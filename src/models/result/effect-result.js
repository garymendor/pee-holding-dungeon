import Result from "./result";

class EffectResult extends Result {
  constructor(data) {
    super(data);
  }

  /**
   * Gets the name of the stat to modify.
   * @returns {string}
   */
  name() {
    return this.data.name;
  }

  /**
   * Gets the new value of the stat.
   * @returns {any}
   */
  value() {
    return this.data.value;
  }
}

export default EffectResult;
