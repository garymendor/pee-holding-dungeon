/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import statusData from '../data/status';
import eventsData from '../data/events';
import StatusCollection from './models/status/status-collection';
import EventCollection from './models/event/event-collection';
import Character from './models/character/character';
import ExecuteEvent from './commands/execute-event';
import UserInput from './ui/cli/user-input';
import EventLoop from './ui/event-loop';

const character = new Character({
  stats: {
    STR: 15,
    DEX: 11,
    INT: 9,
    WIS: 9,
  },
});
const statusCollection = new StatusCollection(statusData);
const eventCollection = new EventCollection(eventsData);
const localeId = process.env.APP_LOCALE;
const eventIds = process.env.APP_EVENT_ID && process.env.APP_EVENT_ID.split(',');
const innEventIds = process.env.APP_INN_EVENT_ID && process.env.APP_INN_EVENT_ID.split(',');
const maxFloorCount = parseInt(process.env.APP_FLOORS) || 15;

if (eventIds && eventIds.length) {
  console.log('Event ID overrides:', eventIds);
}

console.log('Starting character state:');
console.log(character.toString());
console.log('---');
console.log('');

let floorCount = 0;

/**
 * Prints help.
 * @param {Console} output
 */
function help(output) {
  [
    'Allowed commands:',
    '',
    'H - This help',
    'N - Next floor(default)',
    'Q - Quit',
  ].forEach((line) => output.log(line));
}

async function fullRun(output = console) {
  let data = {
    character,
    eventCollection,
    statusCollection,
    localeId,
    output,
  };
  let quit = false;
  while (
    !quit
    && floorCount < maxFloorCount
    && data.character.data.values.humiliation < 10000
  ) {
    data.eventId = (eventIds && eventIds.length > floorCount && eventIds[floorCount])
      || eventCollection.getRandomEventId();

    console.log(`--- Floor ${floorCount + 1}: Adventuring Phase ---`);
    const command = new ExecuteEvent(data);
    data = await command.run();
    console.log('');
    console.log(data.character.toString());

    console.log(`--- Floor ${floorCount + 1}: Inn Phase ---`);
    data.eventId = (innEventIds
        && innEventIds.length > floorCount
        && innEventIds[floorCount])
      || eventCollection.getRandomEventId('floorEnd');
    data = await new ExecuteEvent(data).run();
    console.log('');
    console.log(data.character.toString());

    console.log(`--- Floor ${floorCount + 1}: End ---`);
    floorCount += 1;
    let nextFloor = false;
    while (!nextFloor && !quit) {
      const { responseIndex } = await new UserInput('Main Loop').requestCommand(
        'Type command (H for help)> ',
        ['n', 'h', '?', 'q'],
        {
          caseInsensitive: true,
          allowInvalid: true,
        },
      );
      switch (responseIndex) {
        case 1:
        case 2:
          help(output);
          break;
        case 3:
          quit = true;
          break;
        case 0:
        default:
          nextFloor = true;
          break;
      }
    }
  }
  console.log(`Highest floor reached: ${floorCount}`);
  console.log('');
  console.log('Final character state:');
  console.log('');
  console.log(data.character.toString());
}

if (process.env.APP_TASK_SYSTEM) {
  EventLoop.run({ character, localeId, maxFloorCount, eventIds, innEventIds });
} else {
  fullRun();
}
