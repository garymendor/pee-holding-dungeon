const DEFAULT_LANGID = "en-US";

class LocalizableString {
  /**
   * Creates a new localizable string.
   * @param {string|string[]|any} data
   */
  constructor(data = "") {
    this.data = data;
  }

  static stringOrArray(value) {
    if (typeof value === "string") {
      return value;
    }
    if (Array.isArray(value)) {
      return value.join("\r\n");
    }
    return null;
  }

  /**
   * Gets the localized string for the specified locale ID.
   * @param {string} localeId The locale for which to get a translated string.
   * @returns {string} The string value, or null if the relevant string could not be found.
   */
  get(localeId) {
    if (!this.data) {
      return null;
    }

    const dataString = LocalizableString.stringOrArray(this.data);
    if (dataString) {
      return dataString;
    }

    const localizedValue = this.data[localeId];
    if (localizedValue) {
      const localizedString = LocalizableString.stringOrArray(localizedValue);
      if (localizedString) {
        return localizedString;
      }
    }

    const defaultLocalizedValue = this.data[DEFAULT_LANGID];
    if (defaultLocalizedValue) {
      const localizedString = LocalizableString.stringOrArray(
        defaultLocalizedValue
      );
      if (localizedString) {
        return localizedString;
      }
    }

    return null;
  }
}

export default LocalizableString;
