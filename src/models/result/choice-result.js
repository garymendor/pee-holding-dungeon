/* eslint-disable max-classes-per-file */
import LocalizableString from '../localizable-string';
import ResultCollection from './result-collection';
import Result from './result';

class Choice {
  constructor(data) {
    this.data = {
      ...data,
      description: new LocalizableString(data.description),
      results: new ResultCollection(data.results),
    };
  }

  /**
   * @param {string} localeId
   * @returns {string}
   */
  description(localeId) {
    return this.data.description.get(localeId);
  }

  /**
   * @returns {ResultCollection}
   */
  results() {
    return this.data.results;
  }
}

class ChoiceResult extends Result {
  constructor(data) {
    super(data);
    this.data.choices = data.choices.map((choice) => new Choice(choice));
  }

  /**
   * Gets the choices.
   * @returns {Choice[]}
   */
  choices() {
    return this.data.choices;
  }
}

export default ChoiceResult;
