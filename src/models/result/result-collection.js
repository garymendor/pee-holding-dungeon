import resultCreate from "./result-create";
import Result from "./result";

/**
 * @typedef {import('./result').ResultData} ResultData
 * @typedef {ResultData[]|ResultData} ResultDataCollection
 */

class ResultCollection {
  constructor(data = []) {
    if (Array.isArray(data)) {
      this.data = data.map(resultData => resultCreate(resultData));
      return;
    }
    this.data = [resultCreate(data)];
  }

  /**
   * Gets the collection of `Result` objects.
   * @returns {Result[]}
   */
  items() {
    return this.data;
  }
}

export default ResultCollection;
