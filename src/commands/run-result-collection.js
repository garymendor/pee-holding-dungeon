import RunResult from "./run-result";

/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/result-collection').default} ResultCollection
 * @typedef {Object} RunResultCollectionData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
 * @property {ResultCollection} results
 */

class RunResultCollection {
  /**
   * @param {RunResultCollectionData} data
   */
  constructor(data) {
    /**
     * @type {RunResultCollectionData}
     */
    this.data = data;
  }

  /**
   * Runs the command.
   * @returns {Promise<import('./execute-event').ExecuteEventData>}
   */
  async run() {
    const { results, ...baseData } = this.data;
    let newData = baseData;
    for (const result of results.items()) {
      newData = await new RunResult({
        ...newData,
        result
      }).run();
      if (!newData.continue) {
        return newData;
      }
    }
    return newData;
  }
}

export default RunResultCollection;
