import ExecuteEvent from "./execute-event";

/**
 * @typedef {import('./execute-event').ExecuteEventData} ExecuteEventData
 * @typedef {import('../models/result/event-result').default} EventResult
 * @typedef {ExecuteEventData & {result:EventResult}} RunEventResultData
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
   * @returns {Promise<import('./execute-event').ExecuteEventData>}
   */
  async run() {
    const { result, ...data } = this.data;
    const nextData = await new ExecuteEvent({
      ...data,
      eventId: result.event()
    }).run();
    return {
      ...nextData,
      continue: false
    };
  }
}

export default RunEventResult;
