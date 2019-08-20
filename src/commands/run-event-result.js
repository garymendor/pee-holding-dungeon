import ExecuteEvent from "./execute-event";
/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
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
