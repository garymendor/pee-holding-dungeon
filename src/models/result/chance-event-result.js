import ResultCollection from "./result-collection";
import Result from "./result";

class ChanceEventResult extends Result {
  constructor(data) {
    super(data);
    this.data.events = this.data.events.map(val => ({
      ...val,
      results: new ResultCollection(val)
    }));
  }

  /**
   * @returns {{value:any,results:ResultCollection}[]}
   */
  events() {
    return this.data.events;
  }
}

export default ChanceEventResult;
