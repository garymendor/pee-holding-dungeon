import RunResultCollection from "./run-result-collection";

/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/stat-check-result').default} StatCheckResult
 * @typedef {Object} RunStatCheckResultData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
 * @property {StatCheckResult} result
 */

class RunStatCheckResult {
  /**
   * Creates an instance of `RunMessageResult`.
   * @param {RunStatCheckResultData} data
   */
  constructor(data) {
    /**
     * @type {RunStatCheckResultData}
     */
    this.data = data;
  }

  /**
   * Runs the command.
   * @returns {Promise<import('./execute-event').ExecuteEventData>}
   */
  async run() {
    const { result, ...data } = this.data;
    const { character } = data;
    const actualValue = character.get(result.name());
    if (result.compare(actualValue)) {
      return new RunResultCollection({
        ...data,
        results: result.results()
      }).run();
    }
    return {
      ...data,
      continue: true
    };
  }
}

export default RunStatCheckResult;
