/**
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
