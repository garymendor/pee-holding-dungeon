import Result from "./result";

class ResultCollection {
  constructor(data) {
    if (Array.isArray(data)) {
      this.data = data.map(result => new Result(result));
      return;
    }
    this.data = [new Result(data)];
  }
}

export default ResultCollection;
