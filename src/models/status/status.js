import LocalizableString from "../localizable-string";

class Status {
  constructor(data) {
    this.data = {
      ...data,
      name: new LocalizableString(data.name),
      description: new LocalizableString(data.description)
    };
  }
}

export default Status;
