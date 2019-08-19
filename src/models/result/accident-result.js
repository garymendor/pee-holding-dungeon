import ResultCollection from "./result-collection";
import Result from "./result";

class AccidentResult extends Result {
  constructor(data) {
    super(data);
    this.data.pee = new ResultCollection(this.data.pee);
    this.data.poo = new ResultCollection(this.data.poo);
    this.data.both = new ResultCollection(this.data.both);
  }

  /**
   * Gets the results to run for peeing
   * @returns {ResultCollection}
   */
  pee() {
    return this.data.pee;
  }

  /**
   * Gets the results to run for pooing
   * @returns {ResultCollection}
   */
  poo() {
    return this.data.poo;
  }

  /**
   * Gets the results to run for both peeing and pooing
   * @returns {ResultCollection}
   */
  both() {
    return this.data.both;
  }
}

export default AccidentResult;
