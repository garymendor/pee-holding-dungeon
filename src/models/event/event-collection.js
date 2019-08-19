import Event from "./event";
import fromPairs from "lodash/fromPairs";
import toPairs from "lodash/toPairs";

class EventCollection {
  constructor(data) {
    this.data = fromPairs(
      toPairs(data).map(([key, value]) => [key, new Event(value)])
    );
  }
}

export default EventCollection;
