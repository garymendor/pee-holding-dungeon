import Result from "./result";

class EventResult extends Result {
  constructor(data) {
    super(data);
  }

  /**
   * Gets the event ID to chain to.
   * @returns {string}
   */
  event() {
    return this.data.event;
  }
}

export default EventResult;
