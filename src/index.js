import "core-js/stable";
import "regenerator-runtime/runtime";
import toPairs from "lodash/toPairs";
import statusData from "../data/status";
import StatusCollection from "./models/status/status-collection";
import eventsData from "../data/events";
import EventCollection from "./models/event/event-collection";

const locale = process.env.APP_LOCALE;

console.log("Status effects:");
toPairs(new StatusCollection(statusData).data).forEach(([key, value]) => {
  console.log(`Key: ${key}`);
  console.log(`Name: ${value.data.name.get(locale)}`);
});

console.log("");
console.log("Events:");
toPairs(new EventCollection(eventsData).data).forEach(([key, value]) => {
  console.log(`Key: ${key}`);
  console.log(`Description: ${value.data.description.get(locale)}`);
});
