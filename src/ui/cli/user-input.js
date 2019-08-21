import readline from "readline";

class UserInput {
  /**
   * Creates an instance of `UserInput`.
   * @param {string} contextId
   * The context in which this `UserInput` is requesting input. Used to facilitate mocking.
   */
  constructor(contextId) {
    this.contextId = contextId;
  }

  createReadline() {
    // TODO: Standardize on using streams instead of process.stdin/stdout/stderr
    // and Console separately.
    return readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }
  /**
   * Request a choice from a list.
   * @param {Console} output
   * @param {string[]} choices
   * @returns {Promise<number|string>}
   */
  async requestChoice(output, choices) {
    do {
      choices.forEach((choice, index) =>
        output.log(`[${index + 1}] ${choice}`)
      );
      const response = await this.prompt("> ");
      const responseNum = parseInt(response);
      if (
        isNaN(responseNum) ||
        responseNum < 1 ||
        responseNum > choices.length
      ) {
        continue;
      }
      return responseNum - 1;
    } while (true);
  }

  /**
   * Request one of a set of commands.
   * @param {string[]} commands
   * The list of allowed commands.
   * @param {string} prompt
   * The string to print before asking for input.
   * @param {{allowInvalid:boolean,caseInsensitive:boolean}} options
   * @returns {{response:string,responseIndex:number}}
   * The response submitted by the user, and the index if the response is
   * in the list of commands.
   */
  async requestCommand(prompt, commands, options) {
    const { allowInvalid, caseInsensitive } = options;
    const parsedCommands = caseInsensitive
      ? commands.map(cmd => cmd.toLowerCase())
      : commands;
    do {
      const response = await this.prompt(prompt);
      const parsedResponse = caseInsensitive
        ? response.toLowerCase()
        : response;
      const responseIndex = parsedCommands.indexOf(parsedResponse);
      if (responseIndex >= 0 || allowInvalid) {
        return { response, responseIndex };
      }
    } while (!allowInvalid);
  }

  /**
   * Intended for internal use only, because it doesn't handle mocking well.
   * @returns {Promise<string>}
   */
  async prompt(promptStr) {
    const rl = this.createReadline();
    try {
      return await new Promise(resolve =>
        rl.question(promptStr, answer => resolve(answer))
      );
    } finally {
      rl.close();
    }
  }
}

export default UserInput;
