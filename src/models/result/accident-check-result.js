import ResultCollection from "./result-collection";
import Result from "./result";

/**
 * @typedef {import('../character/character').default} Character
 */

class AccidentCheckResult extends Result {
  constructor(data) {
    super(data);
    this.data.results = new ResultCollection(this.data.results);
  }

  /**
   * Gets the name of the stat to check against.
   * @returns {string}
   */
  name() {
    return this.data.name;
  }

  /**
   * Gets the value of the stat to compare with the character's stat.
   * @returns {any}
   */
  value() {
    return this.data.value;
  }

  /**
   * Gets the name of an extra saving throw to roll before resolving the accident.
   * @returns {string}
   */
  savingThrow() {
    return this.data["saving-throw"];
  }

  /**
   * Gets the DC of the saving throw, if any.
   * @returns {number}
   */
  dc() {
    return this.data.DC;
  }

  /**
   * Compares the character's value for the stat with the target stat.
   * @param {Character} character
   * @returns {string}
   * Returns:
   * * `null`: Accident check succeeded.
   * * `"pee"`: Pee check failed.
   * * `"poo"`: Poo check failed.
   * * `"both"`: Both checks failed.
   */
  compare(character) {
    const needToPee =
      character.get("need-to-pee") + character.get("pee-incontinence");
    const needToPoo =
      character.get("need-to-poo") + character.get("poo-incontinence");
    const isPee = needToPee > this.value();
    const isPoo = needToPoo > this.value();

    if (this.name() === "need-to-pee") {
      return isPee ? "pee" : null;
    }
    if (this.name() === "need-to-poo") {
      return isPoo ? "poo" : null;
    }
    return isPee ? (isPoo ? "both" : "pee") : isPoo ? "poo" : null;
  }

  /**
   * Gets the results to execute if the comparison succeeds.
   * @returns {ResultCollection}
   */
  results() {
    return this.data.results;
  }
}

export default AccidentCheckResult;
