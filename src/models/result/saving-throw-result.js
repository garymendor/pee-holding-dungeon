import ResultCollection from "./result-collection";
import Result from "./result";

export const DEFAULT_DC = 25;

class SavingThrowResult extends Result {
  constructor(data) {
    super(data);
    this.data.failureResults = new ResultCollection(this.data.failureResults);
    this.data.successResults = new ResultCollection(this.data.successResults);
  }

  /**
   * Gets the name of the saving throw to roll against.
   * @returns {string}
   */
  savingThrow() {
    return this.data.savingThrow;
  }

  /**
   * Gets the DC of the saving throw.
   * @returns {number}
   */
  dc() {
    return this.data.DC;
  }

  /**
   * Gets the results to execute if the saving throw fails.
   * @returns {ResultCollection}
   */
  failureResults() {
    return this.data.failureResults;
  }

  /**
   * Gets the results to execute if the saving throw succeeds.
   * @returns {ResultCollection}
   */
  successResults() {
    return this.data.successResults;
  }
}

export default SavingThrowResult;
