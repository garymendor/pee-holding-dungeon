import RunResultCollection from "./run-result-collection";

/**
 * @typedef {import('./execute-event').ExecuteEventData} ExecuteEventData
 * @typedef {import('../models/result/accident-check-result').default} AccidentCheckResult
 * @typedef {ExecuteEventData & {result:AccidentCheckResult}} RunAccidentCheckResultData
 */

class RunAccidentCheckResult {
  /**
   * @param {RunAccidentCheckResultData} data
   */
  constructor(data) {
    /**
     * @type {RunAccidentCheckResultData}
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
    const accident = result.compare(character);
    if (accident) {
      return new RunResultCollection({
        ...data,
        results: result.results(),
        accident
      }).run();
    }
    return { ...data, continue: true };
  }
}

export default RunAccidentCheckResult;
