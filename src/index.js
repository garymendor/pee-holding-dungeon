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

const command = new ExecuteEvent({
  character,
  eventCollection,
  statusCollection,
  localeId,
  eventId
});
command.run().then(newData => {
  if (newData.character !== character) {
    console.log("");
    console.log("---");
    console.log("");
    console.log("New character state:");
    console.log(newData.character.toString());
  }
});
