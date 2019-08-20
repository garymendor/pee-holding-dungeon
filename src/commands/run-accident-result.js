import RunResultCollection from "./run-result-collection";

/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/accident-result').default} AccidentResult
 * @typedef {Object} RunAccidentResultData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
 * @property {AccidentResult} result
 */

class RunAccidentResult {
  /**
   * @param {RunAccidentResultData} data
   */
  constructor(data) {
    /**
     * @type {RunAccidentResultData}
     */
    this.data = data;
  }

  /**
   * Runs the command.
   * @returns {import('./execute-event').ExecuteEventData}
   */
  run() {
    const { result, accident, ...data } = this.data;
    const results = this.getAccidentResults(result, accident);
    if (results) {
      return new RunResultCollection({ ...data, results }).run();
    }
    return {
      ...data,
      continue: true
    };
  }

  getAccidentResults(result, accident) {
    switch (accident) {
      case "pee":
        return result.pee();
      case "poo":
        return result.poo();
      case "both":
        return result.both();
      default:
        return null;
    }
  }
}

export default RunAccidentResult;
