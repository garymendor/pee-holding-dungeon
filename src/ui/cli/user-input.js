import readline from "readline";

class UserInput {
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
