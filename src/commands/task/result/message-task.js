/**
 * @typedef {import('../../../models/result/message-result').default} MessageResult
 * @typedef {import('../task').TaskInput} TaskInput
 * @typedef {import('../task').TaskOutput} TaskOutput
 */

class MessageTask {
  /**
   * @param {MessageResult} result
   */
  constructor(result) {
    this.result = result;
  }

  /**
   * @param {TaskInput} state
   * @returns {TaskOutput}
   */
  run(state) {
    const { localeId } = state;
    return {
      ...state,
      output: [this.result.message(localeId)],
    };
  }
}

export default MessageTask;
