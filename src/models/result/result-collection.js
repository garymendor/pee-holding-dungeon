import resultCreate from "./result-create";
import Result from "./result";

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
