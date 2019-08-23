import RunResultCollection from "./run-result-collection";
import evaluateExpression from "./evaluate-expression";

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
    let isMatch = false;
    if (result.expression()) {
      isMatch = evaluateExpression(
        character.flatData,
        null,
        result.expression()
      );
    } else {
      const actualValue = character.get(result.name());
      isMatch = result.compare(actualValue);
    }
    if (isMatch) {
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
