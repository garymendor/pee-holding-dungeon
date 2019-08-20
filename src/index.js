import "core-js/stable";
import "regenerator-runtime/runtime";
import statusData from "../data/status";
import eventsData from "../data/events";
import StatusCollection from "./models/status/status-collection";
import EventCollection from "./models/event/event-collection";
import Character from "./models/character/character";
import ExecuteEvent from "./commands/execute-event";

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
const eventId = process.env.APP_EVENT_ID || eventCollection.getRandomEventId();

console.log("Starting character state:");
console.log(character.toString());
console.log("---");
console.log("");

let floorCount = 0;

async function fullRun() {
  let data = {
    character,
    eventCollection,
    statusCollection,
    localeId,
    eventId
  };
  while (floorCount < 15 && data.character.data.values.humiliation < 10000) {
    floorCount++;
    console.log(`--- Floor ${floorCount} ---`);
    data.eventId = eventCollection.getRandomEventId();
    const command = new ExecuteEvent(data);
    data = await command.run();
    console.log("");
    console.log("---");
    console.log("");
    console.log(data.character.toString());
    console.log("");
  }
  console.log(`Highest floor reached: ${floorCount}`);
  console.log("");
  console.log("Final character state:");
  console.log("");
  console.log(data.character.toString());
}

fullRun();
