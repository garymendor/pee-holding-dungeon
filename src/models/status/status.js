import LocalizableString from "../localizable-string";

class Status {
  constructor(data) {
    this.data = {
      ...data,
      name: new LocalizableString(data.name),
      description: new LocalizableString(data.description)
    };
  }

  name(localeId) {
    return this.data.name.get(localeId);
  }

  description(localeId) {
    return this.data.description.get(localeId);
  }
}

export default Status;
