/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/result-collection').default} ResultCollection
 * @typedef {import('./execute-event').default} ExecuteEvent
 * @typedef {import('../models/result/accident-check-result').default} AccidentCheckResult
 * @typedef {Object} RunAccidentCheckResultData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
 * @property {ExecuteEvent} executeEventCommand
 * @property {AccidentCheckResult} result
 */

class RunAccidentCheckResult {
  /**
   * @param {RunAccidentCheckResultData} data
   */
  constructor(data) {
    /**
     * @type {RunAccidentCheckResultData}
     */
    this.data = data;
  }

  /**
   * Runs the command.
   * @returns {import('./execute-event').ExecuteEventData}
   */
  run() {
    const { result, character, executeEventCommand } = this.data;
    const accident = result.compare(character);
    if (accident) {
      return executeEventCommand.runResults(result.results(), {
        ...this.data,
        accident
      });
    }
    return { ...this.data, continue: true };
  }
}

export default RunAccidentCheckResult;
