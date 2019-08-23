import RunResultCollection from "./run-result-collection";

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
    let accident = result.compare(character);
    if (accident && result.savingThrow()) {
      // If the config doesn't specify a DC, the DC is Need/10. If the character is
      // having both types of accident, roll a separate DC for each.

      // TODO: Nearly duplicated code with RunSavingThrowResult
      // Save vs. peeing
      if (accident === "pee" || accident === "both") {
        const saveValue = character.get(result.savingThrow());
        const d20 = 1 + Math.floor(Math.random() * 20);
        const dc =
          result.dc() ||
          10 +
            (character.get("need-to-pee") + character.get("pee-incontinence")) /
              10;
        if (saveValue + d20 >= dc) {
          accident = accident === "both" ? "poo" : null;
        }
      }

      // Save vs. pooing
      if (accident === "poo" || accident === "both") {
        const saveValue = character.get(result.savingThrow());
        const d20 = 1 + Math.floor(Math.random() * 20);
        const dc =
          result.dc() ||
          10 +
            (character.get("need-to-poo") + character.get("poo-incontinence")) /
              10;
        if (saveValue + d20 >= dc) {
          accident = accident === "both" ? "pee" : null;
        }
      }
    }
    if (!accident) {
      const results = result.madeItResults();
      if (results.length()) {
        return new RunResultCollection({ ...data, results }).run();
      }
      return { ...data, continue: true };
    }
    return new RunResultCollection({
      ...data,
      results: result.results(),
      accident
    }).run();
  }
}

export default RunAccidentCheckResult;
