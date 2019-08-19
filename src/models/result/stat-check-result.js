import ResultCollection from "./result-collection";
import Result from "./result";

class StatCheckResult extends Result {
  constructor(data) {
    super(data);
    this.data.results = new ResultCollection(this.data.results);
  }

  /**
   * Gets the name of the stat to check against.
   * @returns {string}
   */
  name() {
    return this.data.name;
  }

  /**
   * Gets the value of the stat to compare with the character's stat.
   * @returns {any}
   */
  value() {
    return this.data.value;
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

export default StatCheckResult;
