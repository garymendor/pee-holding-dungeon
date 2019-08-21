import RunResultCollection from "./run-result-collection";
import { DEFAULT_DC } from "../models/result/saving-throw-result";

/**
 * @typedef {import('./run-result').BaseRunResultData<T>} BaseRunResultData
 * @template T
 */

/**
 * @typedef {import('../models/result/accident-check-result').default} AccidentCheckResult
 * @typedef {BaseRunResultData<AccidentCheckResult>} RunAccidentCheckResultData
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
    if (!accident) {
      return { ...data, continue: true };
    }
    if (result.savingThrow()) {
      // TODO: Nearly duplicated code with RunSavingThrowResult
      const saveValue = character.get(result.savingThrow());
      const d20 = 1 + Math.floor(Math.random() * 20);
      if (saveValue + d20 >= (result.dc() || DEFAULT_DC)) {
        return { ...data, continue: true };
      }
    }
    return new RunResultCollection({
      ...data,
      results: result.results(),
      accident
    }).run();
  }
}

export default RunAccidentCheckResult;
