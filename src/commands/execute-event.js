import RunResultCollection from "./run-result-collection";

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
 * @property {boolean} continue
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

    const description = event.description(this.data.localeId);
    if (description) {
      this.data.output.log(description);
    }
    let data = await new RunResultCollection({
      ...this.data,
      results: event.results()
    }).run();
    if (data.continue) {
      // Execute floor-end status events
      for (const statusId in data.character.data.status) {
        const status = data.statusCollection.get(statusId);
        if (status) {
          for (const effectIndex in status.effect()) {
            const effect = status.effect()[effectIndex];
            if (effect.event === "floor-end") {
              data = await new RunResultCollection({
                ...data,
                results: effect.results
              }).run();
            }
          }
        }
      }
    }
    return data;
  }
}

export default ExecuteEvent;
