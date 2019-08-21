import readline from "readline";
import UserInput from "../ui/cli/user-input";
import RunResultCollection from "./run-result-collection";

/**
 * @typedef {import('./run-result').BaseRunResultData<T>} BaseRunResultData
 * @template T
 */

/**
 * @typedef {import('../models/result/choice-result').default} ChoiceResult
 * @typedef {BaseRunResultData<ChoiceResult>} RunChoiceResultData
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
    const responseNum = await new UserInput(this.data.eventId).requestChoice(
      output,
      choices
    );
    const selectedChoice = result.choices()[responseNum];
    return new RunResultCollection({
      ...data,
      results: selectedChoice.results()
    }).run();
  }
}

export default RunChoiceResult;
