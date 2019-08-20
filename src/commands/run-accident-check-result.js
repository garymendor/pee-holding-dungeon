import RunResultCollection from "./run-result-collection";

/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/accident-check-result').default} AccidentCheckResult
 * @typedef {Object} RunAccidentCheckResultData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
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
    const { result, ...data } = this.data;
    const { character } = data;
    const accident = result.compare(character);
    if (accident) {
      return new RunResultCollection({
        ...data,
        results: result.results(),
        accident
      }).run();
    }
    return { ...data, continue: true };
  }
}

export default RunAccidentCheckResult;
