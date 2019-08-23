import ExecuteEvent from "./execute-event";

/**
 * @typedef {import('./run-result').BaseRunResultData<T>} BaseRunResultData
 * @template T
 */

/**
 * @typedef {import('../models/result/event-result').default} EventResult
 * @typedef {BaseRunResultData<EventResult>} RunEventResultData
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
      skipStartEvents: true,
      skipEndEvents: result.continue(),
      eventId: result.event()
    }).run();
    return {
      ...nextData,
      continue: result.continue()
    };
  }
}

export default RunEventResult;
