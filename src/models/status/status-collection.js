import Status from "./status";
import fromPairs from "lodash/fromPairs";
import toPairs from "lodash/toPairs";

class StatusCollection {
  constructor(data) {
    this.data = fromPairs(
      toPairs(data).map(([key, value]) => [key, new Status(value)])
    );
  }
}

export default StatusCollection;
