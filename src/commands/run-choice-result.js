import readlineSync from "readline-sync";
import RunResultCollection from "./run-result-collection";

/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/choice-result').default} ChoiceResult
 * @typedef {Object} RunChoiceResultData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
 * @property {ChoiceResult} result
 */

class RunChoiceResult {
  /**
   * Creates an instance of `RunChoiceResult`.
   * @param {RunChoiceResultData} data
   */
  constructor(data) {
    /**
     * @type {RunChoiceResultData}
     */
    this.data = data;
  }

  /**
   * Runs the command.
   * @returns {Promise<import('./execute-event').ExecuteEventData>}
   */
  async run() {
    const { result, ...data } = this.data;
    const { output, localeId } = data;
    const choices = [];
    // TODO: Localize
    output.log("Choose one of the following actions:");
    for (const choiceIndex in result.choices()) {
      const choice = result.choices()[choiceIndex];
      choices.push(choice.description(localeId));
    }
    // TODO: Make this more general and async-friendly
    do {
      const response = readlineSync.keyInSelect(choices, "Choice> ", {
        cancel: false
      });
      const selectedChoice = result.choices()[response];
      if (selectedChoice) {
        return new RunResultCollection({
          ...data,
          results: selectedChoice.results()
        }).run();
      }
    } while (true);
  }
}

export default RunChoiceResult;
