import resultCreate from "./result-create";
import Result from "./result";
import mapArrayOrSingle from "../map-array-or-single";

/**
 * @typedef {import('./result').ResultData} ResultData
 * @typedef {ResultData[]|ResultData} ResultDataCollection
 */

class ResultCollection {
  /**
   * @param {ResultData[]|ResultData|null} data
   */
  constructor(data = []) {
    this.data = mapArrayOrSingle(data).map(resultData =>
      resultCreate(resultData)
    );
  }

  /**
   * Gets the collection of `Result` objects.
   * @returns {Result[]}
   */
  items() {
    return this.data;
  }

  length() {
    return this.data.length;
  }
}

export default ResultCollection;
