import ResultCollection from "./result-collection";
import Result from "./result";
import compareExpression from "../../commands/compare-expression";

class StatCheckResult extends Result {
  constructor(data) {
    super(data);
    this.data.results = new ResultCollection(this.data.results);
    this.data.elseResults = new ResultCollection(this.data.elseResults);
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

  expression() {
    return this.data.expression;
  }

  /**
   * Compares the character's value for the stat with the target stat.
   * @param {any} value
   * The character's value for the stat.
   */
  compare(value) {
    return compareExpression(value, this.data.value);
  }

  /**
   * Gets the results to execute if the comparison succeeds.
   * @returns {ResultCollection}
   */
  results() {
    return this.data.results;
  }

  /**
   * Gets the results to execute if the comparison fails.
   * @returns {ResultCollection}
   */
  elseResults() {
    return this.data.elseResults;
  }
}

export default StatCheckResult;
