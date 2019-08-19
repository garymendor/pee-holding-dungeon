import ResultCollection from "../result/result-collection";
import Status from "./status";
import fromPairs from "lodash/fromPairs";
import toPairs from "lodash/toPairs";

class StatusCollection {
  constructor(data = {}) {
    this.data = fromPairs(
      toPairs(data).map(([key, value]) => [key, new Status(value)])
    );
    this.onStatus = {};
    toPairs(data)
      .filter(([, value]) => value["on-status"])
      .map(([, { "on-status": { name, value, results } }]) => [
        name,
        {
          value,
          results: new ResultCollection(results)
        }
      ])
      .forEach(([key, value]) => {
        const onStatus = this.onStatus[key] || [];
        this.onStatus[key] = [...onStatus, value];
      });
  }

  /**
   * Gets the status event info with the specified `statusId`.
   * @param {string} statusId
   * @returns {Status}
   */
  get(statusId) {
    return this.data[statusId];
  }

  /**
   * Get all onStatus effects for the specified status id.
   * @param {string} statusId
   * @returns {{value:any,results:ResultCollection}[]}
   */
  getOnStatus(statusId) {
    return this.onStatus[statusId];
  }
}

export default StatusCollection;
