import mapValues from "lodash/mapValues";
import LocalizableString from "../localizable-string";
import ResultCollection from "../result/result-collection";
import mapArrayOrSingle from "../map-array-or-single";

/**
 * @typedef {import('../result/result-collection').ResultDataCollection} ResultDataCollection
 */

/**
 * @typedef {Object} OnStatusValue
 * @property {any} value
 * @property {ResultCollection} results
 */

class Status {
  constructor(data) {
    this.data = {
      ...data,
      tags: mapArrayOrSingle(data.tags),
      name: new LocalizableString(data.name),
      description: new LocalizableString(data.description),
      effect: mapValues(data.effect, results => new ResultCollection(results)),
      tagTriggers: mapValues(
        data.tagTriggers,
        results => new ResultCollection(results)
      ),
      onStatus: mapValues(data.onStatus, onStatusData =>
        mapArrayOrSingle(onStatusData).map(onStatus => ({
          value: onStatus.value,
          results: new ResultCollection(onStatus.results)
        }))
      )
    };
  }

  name(localeId) {
    return this.data.name.get(localeId);
  }

  description(localeId) {
    return this.data.description.get(localeId);
  }

  /**
   * @returns {Object<string,{value:any,results:ResultCollection}>}
   */
  onStatus() {
    return this.data.onStatus;
  }

  /**
   * @returns {Object<string,ResultDataCollection>}
   */
  effect() {
    return this.data.effect;
  }

  /**
   * Gets the
   * @returns {string[]}
   */
  tags() {
    return this.data.tags;
  }

  /**
   * @returns {Object<string,ResultCollection>}
   */
  tagTriggers() {
    return this.data.tagTriggers;
  }
}

export default Status;
