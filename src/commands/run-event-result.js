import ExecuteEvent from "./execute-event";
/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/result-collection').default} ResultCollection
 * @typedef {import('../models/result/event-result').default} EventResult
 * @typedef {Object} RunEventResultData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
 * @property {EventResult} result
 */

/**
 * @class
 */
class RunEventResult {
  /**
   * Creates an instance of `RunEventResult`.
   * @param {RunEventResultData} data
   */
  constructor(data) {
    /**
     * @type {RunEventResultData}
     */
    this.data = data;
  }

  /**
   * Runs the command.
   */
  run() {
    const nextEvent = new ExecuteEvent({
      ...this.data,
      eventId: this.data.result.event()
    });
    return {
      ...nextEvent.run(),
      continue: false
    };
  }
}

export default RunEventResult;
