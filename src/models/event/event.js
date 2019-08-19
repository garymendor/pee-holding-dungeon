import LocalizableString from "../localizable-string";
import ResultCollection from "./result-collection";

class Event {
  constructor(data) {
    this.data = {
      ...data,
      description: new LocalizableString(data.description),
      results: new ResultCollection(data.results)
    };
  }
}

export default Event;
