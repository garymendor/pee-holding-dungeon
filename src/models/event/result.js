class Result {
  constructor(data) {
    if (typeof data === "string") {
      this.data = {
        type: "event",
        event: data
      };
      return;
    }
    this.data = {
      type: "effect",
      ...data
    };
  }
}

export default Result;
