import mapValues from "lodash/mapValues";
import LocalizableString from "../localizable-string";
import ResultCollection from "../result/result-collection";
import mapArrayOrSingle from "../map-array-or-single";

/**
 * @typedef {import('../result/result-collection').ResultDataCollection} ResultDataCollection
 */

class Status {
  constructor(data) {
    this.data = {
      ...data,
      tags: mapArrayOrSingle(data.tags),
      name: new LocalizableString(data.name),
      description: new LocalizableString(data.description)
    };
    this.data.effect = mapValues(
      this.data.effect,
      results => new ResultCollection(results)
    );
    this.data.tagTriggers = mapValues(
      this.data.tagTriggers,
      results => new ResultCollection(results)
    );
  }

  name(localeId) {
    return this.data.name.get(localeId);
  }

  description(localeId) {
    return this.data.description.get(localeId);
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
