import fromPairs from 'lodash/fromPairs';
import toPairs from 'lodash/toPairs';
import Event from './event';
import applyTemplates from '../apply-templates';
import eventsData from '../../../data/events';

/**
 * @type {EventCollection}
 */
let instance;

class EventCollection {
  constructor(data = {}) {
    this.data = fromPairs(
      toPairs(applyTemplates(data)).map(([key, value]) => [
        key,
        new Event(value),
      ]),
    );
    this.keysByType = {};
    for (const eventId in this.data) {
      const eventType = this.data[eventId].type();
      this.keysByType[eventType] = [
        ...(this.keysByType[eventType] || []),
        eventId,
      ];
    }
  }

  /**
   * @returns {EventCollection}
   */
  static Instance() {
    instance = instance || new EventCollection(eventsData);
    return instance;
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
   * Gets a random event ID using `Math.random`.
   * @param {string} type
   * @returns {string}
   */
  getRandomEventId(type = 'floor') {
    const index = Math.floor(Math.random() * this.keysByType[type].length);
    return this.keysByType[type][index];
  }
}

export const { Instance } = EventCollection;

export default EventCollection;
