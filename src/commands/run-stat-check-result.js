import RunResultCollection from "./run-result-collection";

/**
 * @typedef {import('./execute-event').ExecuteEventData} ExecuteEventData
 * @typedef {import('../models/result/stat-check-result').default} StatCheckResult
 * @typedef {ExecuteEventData & {result:StatCheckResult}} RunStatCheckResultData
 */

class RunStatCheckResult {
  /**
   * Creates an instance of `RunMessageResult`.
   * @param {RunStatCheckResultData} data
   */
  constructor(data) {
    /**
     * @type {RunStatCheckResultData}
     */
    this.data = data;
  }

  /**
   * Runs the command.
   * @returns {Promise<import('./execute-event').ExecuteEventData>}
   */
  async run() {
    const { result, ...data } = this.data;
    const { character } = data;
    const actualValue = character.get(result.name());
    if (result.compare(actualValue)) {
      return new RunResultCollection({
        ...data,
        results: result.results()
      }).run();
    }
    return {
      ...data,
      continue: true
    };
  }
}

export default RunStatCheckResult;
