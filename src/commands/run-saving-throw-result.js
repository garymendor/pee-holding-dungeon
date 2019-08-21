import RunResultCollection from "./run-result-collection";

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
    if (saveValue + d20 < result.dc()) {
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

export default RunSavingThrowResult;
