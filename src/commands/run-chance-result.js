import UserInput from "../ui/cli/user-input";
import RunResultCollection from "./run-result-collection";
import evaluateExpression from "./evaluate-expression";

/**
 * @typedef {import('./run-result').BaseRunResultData<T>} BaseRunResultData
 * @template T
 */

/**
 * @typedef {import('../models/result/chance-result').default} ChanceResult
 * @typedef {BaseRunResultData<ChanceResult>} RunChanceResultData
 */

class RunChanceResult {
  /**
   * Creates an instance of `RunChanceResult`.
   * @param {RunChanceResultData} data
   */
  constructor(data) {
    /**
     * @type {RunChanceResultData}
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
    const eventValues = result
      .events()
      .map(event => evaluateExpression(character.flatData, null, event.value));
    const eventSum = eventValues.reduce((sum, val) => sum + val, 0);
    let roll = Math.floor(Math.random() * eventSum);
    let selectedIndex = 0;
    while (roll > 0) {
      if (roll < eventValues[selectedIndex]) {
        break;
      }
      roll -= eventValues[selectedIndex];
      selectedIndex++;
    }
    const selectedEvent = result.events()[selectedIndex];
    return new RunResultCollection({
      ...data,
      results: selectedEvent.results
    }).run();
  }
}

export default RunChanceResult;
