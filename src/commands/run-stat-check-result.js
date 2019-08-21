import RunResultCollection from "./run-result-collection";

/**
 * @typedef {import('./run-result').BaseRunResultData<T>} BaseRunResultData
 * @template T
 */

/**
 * @typedef {import('../models/result/stat-check-result').default} StatCheckResult
 * @typedef {BaseRunResultData<StatCheckResult>} RunStatCheckResultData
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
      const results = result.results();
      if (results.length()) {
        return await new RunResultCollection({
          ...data,
          results
        }).run();
      }
    } else {
      const results = result.elseResults();
      if (results.length()) {
        return await new RunResultCollection({
          ...data,
          results
        }).run();
      }
    }
    return {
      ...data,
      continue: true
    };
  }
}

export default RunStatCheckResult;
