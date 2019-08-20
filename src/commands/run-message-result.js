/**
 * @typedef {import('./execute-event').ExecuteEventData} ExecuteEventData
 * @typedef {import('../models/result/message-result').default} MessageResult
 * @typedef {ExecuteEventData & {result:MessageResult}} RunMessageResultData
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
