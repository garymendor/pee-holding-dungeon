import Status from "./status";
import fromPairs from "lodash/fromPairs";
import toPairs from "lodash/toPairs";

class StatusCollection {
  constructor(data = {}) {
    this.data = fromPairs(
      toPairs(data).map(([key, value]) => [key, new Status(value)])
    );
  }

  /**
   * Gets the status event info with the specified `statusId`.
   * @param {string} statusId
   * @returns {Status}
   */
  get(statusId) {
    return this.data[statusId];
  }
}

export default StatusCollection;
