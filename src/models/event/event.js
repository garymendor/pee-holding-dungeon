import LocalizableString from "../localizable-string";
import ResultCollection from "../result/result-collection";

class Event {
  constructor(data) {
    this.data = {
      ...data,
      description: new LocalizableString(data.description),
      results: new ResultCollection(data.results)
    };
  }

  /**
   * Gets the parent event for this event.
   *
   * @returns {string}
   * The event ID for the parent event, or null for a root event.
   */
  parent() {
    return this.data.parent;
  }

  /**
   * Gets the description of the event.
   *
   * @param {string} localeId
   * The locale to translate into.
   * @returns {string|LocalizableString}
   * If `localeId` is null, return the LocalizableString; otherwise, return the translation.
   */
  description(localeId = null) {
    if (!localeId) {
      return this.data.description;
    }
    return this.data.description.get(localeId);
  }

  /**
   * Gets the results associated with the event.
   *
   * @returns {ResultCollection}
   */
  results() {
    return this.data.results;
  }
}

export default Event;
