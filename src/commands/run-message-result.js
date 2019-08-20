/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/result-collection').default} ResultCollection
 * @typedef {import('../models/result/message-result').default} MessageResult
 * @typedef {Object} RunMessageResultData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
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
   * @returns {Promise<import('./execute-event').ExecuteEventData>}
   */
  async run() {
    const { result, ...data } = this.data;
    const { output, localeId } = data;
    output.log(result.message(localeId));
    return {
      ...data,
      continue: true
    };
  }
}

export default RunMessageResult;
