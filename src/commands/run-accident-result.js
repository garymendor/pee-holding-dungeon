import RunResultCollection from "./run-result-collection";

/**
 * @typedef {import('./run-result').BaseRunResultData<T>} BaseRunResultData
 * @template T
 */

/**
 * @typedef {import('../models/result/accident-result').default} AccidentResult
 * @typedef {BaseRunResultData<AccidentResult> & {accident:string}} RunAccidentResultData
 */

class RunAccidentResult {
  /**
   * @param {RunAccidentResultData} data
   */
  constructor(data) {
    /**
     * @type {RunAccidentResultData}
     */
    this.data = data;
  }

  /**
   * Runs the command.
   * @returns {Promise<import('./execute-event').ExecuteEventData>}
   */
  async run() {
    const { result, accident, ...data } = this.data;
    const results = this.getAccidentResults(result, accident);
    if (results) {
      return new RunResultCollection({ ...data, results }).run();
    }
    return {
      ...data,
      continue: true
    };
  }

  /**
   * @param {AccidentResult} result
   * @param {string} accident
   * @returns {?ResultCollection}
   */
  getAccidentResults(result, accident) {
    switch (accident) {
      case "pee":
        return result.pee();
      case "poo":
        return result.poo();
      case "both":
        return result.both();
      default:
        return null;
    }
  }
}

export default RunAccidentResult;
