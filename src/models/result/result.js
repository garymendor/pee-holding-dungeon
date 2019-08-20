/**
 * @typedef {{type:string}} ResultData
 */

class Result {
  constructor(data) {
    this.data = data;
  }

  /**
   * Gets the type of the event.
   * @returns {string}
   */
  type() {
    return this.data.type;
  }
}

export default Result;
