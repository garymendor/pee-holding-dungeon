import ResultCollection from "../result/result-collection";
import Status from "./status";
import fromPairs from "lodash/fromPairs";
import toPairs from "lodash/toPairs";
import mapArrayOrSingle from "../map-array-or-single";
import applyTemplates from "../apply-templates";

class StatusCollection {
  constructor(data = {}) {
    /**
     * @type {Object<string,Status>}
     */
    this.data = fromPairs(
      toPairs(applyTemplates(data)).map(([key, value]) => [
        key,
        new Status(value)
      ])
    );
    this.onStatus = {};
    for (const statusKey in this.data) {
      const onStatusValues = this.data[statusKey].onStatus();
      for (const onStatusKey in onStatusValues) {
        const onStatusValue = onStatusValues[onStatusKey];
        const existingOnStatus = this.onStatus[onStatusKey] || [];
        this.onStatus[onStatusKey] = [...existingOnStatus, onStatusValue];
      }
    }
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
