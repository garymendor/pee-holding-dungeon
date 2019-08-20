import LocalizableString from "../localizable-string";
import ResultCollection from "../result/result-collection";

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
    // TODO: Effect and EffectCollection
    if (Array.isArray(this.data.effect)) {
      this.data.effect = this.data.effect.map(effect => ({
        ...effect,
        results: new ResultCollection(effect.results)
      }));
    } else if (this.data.effect) {
      this.data.effect = [
        {
          ...this.data.effect,
          results: new ResultCollection(this.data.effect.results)
        }
      ];
    }
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
