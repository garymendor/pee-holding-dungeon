/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/result-collection').default} ResultCollection
 * @typedef {import('./execute-event').default} ExecuteEvent
 * @typedef {import('../models/result/accident-result').default} AccidentResult
 * @typedef {Object} RunAccidentResultData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
 * @property {ExecuteEvent} executeEventCommand
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
    const { result, accident, executeEventCommand } = this.data;
    let results = null;
    switch (accident) {
      case "pee":
        results = result.pee();
        break;
      case "poo":
        results = result.poo();
        break;
      case "both":
        results = result.both();
        break;
    }
    if (results) {
      return executeEventCommand.runResults(results, {
        ...this.data,
        accident: null
      });
    }
    return {
      ...this.data,
      accident: null,
      continue: true
    };
  }
}

export default RunAccidentResult;
