import LocalizableString from "../localizable-string";
import ResultCollection from "../result/result-collection";
import mapValues from "lodash/mapValues";

/**
 * @typedef {import('../result/result-collection').ResultDataCollection} ResultDataCollection
 */

class Status {
  constructor(data) {
    this.data = {
      ...data,
      name: new LocalizableString(data.name),
      description: new LocalizableString(data.description)
    };
    this.data.effect = mapValues(
      this.data.effect,
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
}

export default Status;
