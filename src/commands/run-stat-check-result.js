/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/result-collection').default} ResultCollection
 * @typedef {import('./execute-event').default} ExecuteEvent
 * @typedef {import('../models/result/stat-check-result').default} StatCheckResult
 * @typedef {Object} RunStatCheckResultData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
 * @property {ExecuteEvent} executeEventCommand
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
   * @returns {import('./execute-event').ExecuteEventData}
   */
  run() {
    const { result, executeEventCommand } = this.data;
    const actualValue = this.data.character.get(result.name());
    if (result.compare(actualValue)) {
      return executeEventCommand.runResults(result.results(), this.data);
    }
    return {
      ...this.data,
      continue: true
    };
  }
}

export default RunStatCheckResult;
