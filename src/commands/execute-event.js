import RunResultCollection from "./run-result-collection";
import TriggerStatusEvent from "./trigger-status-event";

/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/result-collection').default} ResultCollection
 * @typedef {import('../models/result/result').default} Result
 */

/**
 * @typedef {Object} ExecuteEventData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
 * @property {boolean} skipStartEvents
 * True if this event was triggered by another event.
 * @property {Object<string,boolean>} tags
 * A collection of tags currently in effect.
 * @property {boolean} continue
 * @property {boolean} skipEndEvents
 */

class ExecuteEvent {
  /**
   *
   * @param {ExecuteEventData} data
   */
  constructor(data) {
    /**
     * @type {ExecuteEventData}
     */
    this.data = {
      output: console,
      tags: {},
      ...data
    };
  }

  /**
   * @returns {Promise<ExecuteEventData>}
   */
  async run() {
    const event = this.data.eventCollection.get(this.data.eventId);
    if (!event) {
      return this.data;
    }
    const { character, statusCollection, output, localeId } = this.data;
    const { skipStartEvents, skipEndEvents, ...baseData } = this.data;
    let data = baseData;

    // Apply event tags
    event.tags().forEach(tag => {
      data.tags[tag] = true;
    });

    // Apply status effect tags
    for (const statusId in character.data.status) {
      const status = statusCollection.get(statusId);
      if (!status) {
        output.debug("No status entry found for statusId", statusId);
      }
      status.tags().forEach(tag => (data.tags[tag] = true));
    }

    if (!skipStartEvents) {
      // Floor start behavior
      console.debug(`Floor start: ${this.data.eventId}`);
      for (const statusId in character.data.status) {
        const status = statusCollection.get(statusId);
        for (const tag in data.tags) {
          const tagResults = status.tagTriggers()[tag];
          if (tagResults && tagResults.length()) {
            data = await new RunResultCollection({
              ...data,
              results: tagResults
            }).run();
          }
        }
      }
    }

    const description = event.description(localeId);
    if (description) {
      output.log(description);
    }
    data = await new RunResultCollection({
      ...data,
      results: event.results()
    }).run();

    if (data.continue && !skipEndEvents) {
      console.debug(`Floor end: ${this.data.eventId}`);
      // Floor end behavior
      // Execute floor-end status events
      ({ character: data.character } = await new TriggerStatusEvent().run({
        ...data,
        triggerId: "floor-end"
      }));
    }
    return data;
  }
}

export default ExecuteEvent;
