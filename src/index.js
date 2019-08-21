import "core-js/stable";
import "regenerator-runtime/runtime";
import statusData from "../data/status";
import eventsData from "../data/events";
import StatusCollection from "./models/status/status-collection";
import EventCollection from "./models/event/event-collection";
import Character from "./models/character/character";
import ExecuteEvent from "./commands/execute-event";
import UserInput from "./ui/cli/user-input";

const character = new Character({
  stats: {
    STR: 15,
    DEX: 11,
    INT: 9,
    WIS: 9
  }
});
const statusCollection = new StatusCollection(statusData);
const eventCollection = new EventCollection(eventsData);
const localeId = process.env.APP_LOCALE;
const eventIds =
  process.env.APP_EVENT_ID && process.env.APP_EVENT_ID.split(",");
const maxFloorCount = parseInt(process.env.APP_FLOORS) || 15;

if (eventIds && eventIds.length) {
  console.log("Event ID overrides:", eventIds);
}

console.log("Starting character state:");
console.log(character.toString());
console.log("---");
console.log("");

let floorCount = 0;

/**
 * Prints help.
 * @param {Console} output
 */
function help(output) {
  [
    "Allowed commands:",
    "",
    "H - This help",
    "N - Next floor(default)",
    "C - Change panties",
    "Q - Quit"
  ].forEach(line => output.log(line));
}

async function fullRun(output = console) {
  let data = {
    character,
    eventCollection,
    statusCollection,
    localeId,
    output
  };
  let quit = false;
  while (
    !quit &&
    floorCount < maxFloorCount &&
    data.character.data.values.humiliation < 10000
  ) {
    data.eventId =
      (eventIds && eventIds.length > floorCount && eventIds[floorCount]) ||
      eventCollection.getRandomEventId();
    floorCount++;
    console.log(`--- Floor ${floorCount} ---`);
    const command = new ExecuteEvent(data);
    data = await command.run();
    console.log("");
    console.log("---");
    console.log("");
    console.log(data.character.toString());
    console.log("");
    let nextFloor = false;
    while (!nextFloor && !quit) {
      const { responseIndex } = await new UserInput("Main Loop").requestCommand(
        "Type command (H for help)> ",
        ["n", "h", "?", "c", "q"],
        {
          caseInsensitive: true,
          allowInvalid: true
        }
      );
      switch (responseIndex) {
        case 1:
        case 2:
          help(output);
          break;
        case 3:
          output.log("Changing not yet supported.");
          break;
        case 4:
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
  console.log("");
  console.log("Final character state:");
  console.log("");
  console.log(data.character.toString());
}

fullRun();
