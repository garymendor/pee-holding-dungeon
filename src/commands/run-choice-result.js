import readlineSync from "readline-sync";
/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/result-collection').default} ResultCollection
 * @typedef {import('./execute-event').default} ExecuteEvent
 * @typedef {import('../models/result/choice-result').default} ChoiceResult
 * @typedef {Object} RunChoiceResultData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
 * @property {ExecuteEvent} executeEventCommand
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
   * @returns {import('./execute-event').ExecuteEventData}
   */
  run() {
    const choices = [];
    const { result, output, executeEventCommand } = this.data;
    // TODO: Localize
    output.log("Choose one of the following actions:");
    for (const choiceIndex in result.choices()) {
      const choice = result.choices()[choiceIndex];
      choices.push(choice.description(this.data.localeId));
    }
    // TODO: Make this more general and async-friendly
    do {
      const response = readlineSync.keyInSelect(choices, "Choice> ", {
        cancel: false
      });
      const selectedChoice = result.choices()[response];
      if (selectedChoice) {
        return executeEventCommand.runResults(
          selectedChoice.results(),
          this.data
        );
      }
    } while (true);
  }
}

export default RunChoiceResult;
