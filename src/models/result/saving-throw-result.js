import ResultCollection from "./result-collection";
import Result from "./result";

class SavingThrowResult extends Result {
  constructor(data) {
    super(data);
    this.data.results = new ResultCollection(this.data.results);
  }

  /**
   * Gets the name of the saving throw to roll against.
   * @returns {string}
   */
  savingThrow() {
    return this.data["saving-throw"];
  }

  /**
   * Gets the DC of the saving throw.
   * @returns {number}
   */
  dc() {
    return this.data.DC;
  }

  /**
   * Compares the character's value for the stat with the target stat.
   * @param {any} value
   * The character's value for the stat.
   */
  compare(value) {
    if (!value) {
      return !this.data.value;
    }
    return this.data.value === value;
  }

  /**
   * Gets the results to execute if the comparison succeeds.
   * @returns {ResultCollection}
   */
  results() {
    return this.data.results;
  }
}

export default SavingThrowResult;
