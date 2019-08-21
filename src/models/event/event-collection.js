import Event from "./event";
import fromPairs from "lodash/fromPairs";
import toPairs from "lodash/toPairs";

class EventCollection {
  constructor(data = {}) {
    this.data = fromPairs(
      toPairs(data).map(([key, value]) => [key, new Event(value)])
    );
    this.rootKeysValue = toPairs(this.data)
      .filter(([, value]) => value.type() === "floor")
      .map(([key]) => key);
  }

  /**
   * Gets the event with the specified ID.
   * @param {string} eventId
   * @returns {Event}
   */
  get(eventId) {
    return this.data[eventId];
  }

  /**
   * Gets the collection of all event IDs.
   * @returns {string[]}
   */
  keys() {
    return Object.keys(this.data);
  }

  /**
   * Gets the collection of root event IDs.
   * @returns {string[]}
   */
  rootKeys() {
    return this.rootKeysValue;
  }

  /**
   * Gets a random event ID using `Math.random`.
   * @returns {string}
   */
  getRandomEventId() {
    const index = Math.floor(Math.random() * this.rootKeys().length);
    return this.rootKeys()[index];
  }
}

export default EventCollection;
