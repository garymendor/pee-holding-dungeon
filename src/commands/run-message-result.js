/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/result-collection').default} ResultCollection
 * @typedef {import('./execute-event').default} ExecuteEvent
 * @typedef {import('../models/result/message-result').default} MessageResult
 * @typedef {Object} RunMessageResultData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
 * @property {ExecuteEvent} executeEventCommand
 * @property {MessageResult} result
 */

class RunMessageResult {
  /**
   * Creates an instance of `RunMessageResult`.
   * @param {RunMessageResultData} data
   */
  constructor(data) {
    /**
     * @type {RunMessageResultData}
     */
    this.data = data;
  }

  /**
   * Runs the command.
   * @returns {import('./execute-event').ExecuteEventData}
   */
  run() {
    const { output, result, localeId } = this.data;
    output.log(result.message(localeId));
    return {
      ...this.data,
      continue: true
    };
  }
}

export default RunMessageResult;
