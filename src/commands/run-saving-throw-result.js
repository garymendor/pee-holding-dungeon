import RunResultCollection from "./run-result-collection";
import { DEFAULT_DC } from "../models/result/saving-throw-result";

/**
 * @typedef {import('./run-result').BaseRunResultData<T>} BaseRunResultData
 * @template T
 */

/**
 * @typedef {import('../models/result/saving-throw-result').default} SavingThrowResult
 * @typedef {BaseRunResultData<SavingThrowResult>} RunSavingThrowResultData
 */

class RunSavingThrowResult {
  /**
   * @param {RunSavingThrowResultData} data
   */
  constructor(data) {
    /**
     * @type {RunSavingThrowResultData}
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
    const saveValue = character.get(result.savingThrow());
    const d20 = 1 + Math.floor(Math.random() * 20);
    if (saveValue + d20 >= (result.dc() || DEFAULT_DC)) {
      const results = result.successResults();
      if (results.length) {
        return new RunResultCollection({
          ...data,
          results
        }).run();
      }
    } else {
      const results = result.failureResults();
      if (results.length) {
        return new RunResultCollection({
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

export default RunSavingThrowResult;
