import RunEffectResult from "./run-effect-result";
import RunEventResult from "./run-event-result";
import RunMessageResult from "./run-message-result";
import RunChoiceResult from "./run-choice-result";
import RunStatCheckResult from "./run-stat-check-result";
import RunAccidentCheckResult from "./run-accident-check-result";
import RunAccidentResult from "./run-accident-result";
import RunSavingThrowResult from "./run-saving-throw-result";

/**
 * @typedef {import('./execute-event').ExecuteEventData} ExecuteEventData
 * @typedef {import('../models/result/result').default} Result
 */

/**
 * @typedef {Object} RunResultFields
 * @property {T} result
 * @property {boolean?} invert
 * @template T
 */

/**
 * @typedef {ExecuteEventData & RunResultFields<T>} BaseRunResultData
 * @template T
 */

/**
 * @typedef {BaseRunResultData<Result>} RunResultData
 */

class RunResult {
  /**
   * @param {RunResultData} data
   */
  constructor(data) {
    /**
     * @type {RunResultData}
     */
    this.data = data;
  }

  /**
   * Runs the command.
   * @returns {Promise<import('./execute-event').ExecuteEventData>}
   */
  async run() {
    const { output, result } = this.data;
    const resultTypeMap = {
      event: RunEventResult,
      effect: RunEffectResult,
      message: RunMessageResult,
      choice: RunChoiceResult,
      "stat-check": RunStatCheckResult,
      "accident-check": RunAccidentCheckResult,
      accident: RunAccidentResult,
      "saving-throw": RunSavingThrowResult
    };
    const RunSpecificResult = resultTypeMap[result.type()];
    if (!RunSpecificResult) {
      output.error(`Not supported: ${result.type()}`);
      return this.data;
    }
    return new RunSpecificResult(this.data).run();
  }
}

export default RunResult;
