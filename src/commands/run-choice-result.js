import readline from "readline";
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
    do {
      choices.forEach((choice, index) =>
        output.log(`[${index + 1}] ${choice}`)
      );
      // TODO: Standardize on using streams instead of process.stdin/stdout/stderr
      // and Console separately.
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      let response;
      try {
        response = await new Promise(resolve =>
          rl.question("> ", answer => resolve(answer))
        );
      } finally {
        rl.close();
      }
      const responseNum = parseInt(response);
      if (
        responseNum === NaN ||
        responseNum < 1 ||
        responseNum > result.choices().length
      ) {
        continue;
      }
      const selectedChoice = result.choices()[responseNum - 1];
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
