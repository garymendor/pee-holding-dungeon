const DEFAULT_LANGID = "en-US";

class LocalizableString {
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

  get(langId, accidentType = "both") {
    const dataString = LocalizableString.stringOrArray(this.data);
    if (dataString) {
      return dataString;
    }

    const localizedValue = this.data[langId];
    if (localizedValue) {
      const localizedString = LocalizableString.stringOrArray(localizedValue);
      if (localizedString) {
        return localizedString;
      }

      return LocalizableString.stringOrArray(localizedValue[accidentType]);
    }
    const defaultLocalizedValue = this.data[DEFAULT_LANGID];
    if (defaultLocalizedValue) {
      const localizedString = LocalizableString.stringOrArray(
        defaultLocalizedValue
      );
      if (localizedString) {
        return localizedString;
      }

      return LocalizableString.stringOrArray(localizedValue[accidentType]);
    }

    return LocalizableString.stringOrArray(this.data[accidentType]);
  }
}

export default LocalizableString;
