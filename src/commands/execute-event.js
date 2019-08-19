import readlineSync from "readline-sync";

/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/result-collection').default} ResultCollection
 * @typedef {import('../models/result/result').default} Result
 * @typedef {import('../models/result/event-result').default} EventResult
 * @typedef {import('../models/result/effect-result').default} EffectResult
 * @typedef {import('../models/result/message-result').default} MessageResult
 * @typedef {import('../models/result/choice-result').default} ChoiceResult
 * @typedef {import('../models/result/stat-check-result').default} StatCheckResult
 * @typedef {import('../models/result/accident-check-result').default} AccidentCheckResult
 * @typedef {import('../models/result/accident-result').default} AccidentResult
 * @typedef {import('../models/result/saving-throw-result').default} SavingThrowResult
 */

/**
 * @typedef {Object} ExecuteEventData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 */

class ExecuteEvent {
  /**
   *
   * @param {ExecuteEventData} data
   */
  constructor(data) {
    this.data = {
      ...data,
      events: []
    };
  }

  run(output = console) {
    const event = this.data.eventCollection.get(this.data.eventId);
    if (!event) {
      return;
    }

    const description = event.description(this.data.localeId);
    if (description) {
      output.log(description);
    }
    this.runResults(event.results(), output);
    return this.data.character;
  }

  /**
   * Runs a collection of events.
   * @param {ResultCollection} results
   * @param {Console} output
   */
  runResults(results, output) {
    for (const result of results.items()) {
      if (!this.runResult(result, output)) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param {Result} result
   * @param {Console} output
   */
  runResult(result, output) {
    const resultTypeMap = {
      event: this.runEvent,
      effect: this.runEffect,
      message: this.runMessage,
      choice: this.runChoice,
      "stat-check": this.runStatCheck,
      "accident-check": this.runAccidentCheck,
      accident: this.runAccident,
      "saving-throw": this.runSavingThrow
    };
    const runResultMethod = resultTypeMap[result.type()];
    if (!runResultMethod) {
      output.error(`Not supported: ${result.type()}`);
      return true;
    }
    return runResultMethod.call(this, result, output);
  }

  /**
   *
   * @param {EventResult} result
   * @param {Console} output
   */
  runEvent(result, output) {
    const nextEvent = new ExecuteEvent({
      ...this.data,
      eventId: result.event()
    });
    this.data.character = nextEvent.run(output);
    return false;
  }

  /**
   * @param {EffectResult} result
   */
  runEffect(result) {
    this.data.character = this.data.character.apply(
      result.data.name,
      result.data.value,
      this.data.events
    );
    // TODO: Run the events through the status effects
    return true;
  }

  /**
   * @param {MessageResult} result
   * @param {Console} output
   */
  runMessage(result, output) {
    output.log(result.message(this.data.localeId));
    return true;
  }

  /**
   * @param {ChoiceResult} result
   * @param {Console} output
   */
  runChoice(result, output) {
    const choices = [];
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
        if (!this.runResults(selectedChoice.results())) {
          return false;
        }
        return true;
      }
    } while (true);
  }

  /**
   * @param {StatCheckResult} result
   * @param {Console} output
   */
  runStatCheck(result, output) {
    const actualValue = this.data.character.get(result.name());
    if (result.compare(actualValue)) {
      if (!this.runResults(result.results(), output)) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param {AccidentCheckResult} result
   * @param {Console} output
   */
  runAccidentCheck(result, output) {
    this.data.accident = result.compare(this.data.character);
    if (this.data.accident) {
      if (!this.runResults(result.results(), output)) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param {AccidentResult} result
   * @param {Console} output
   */
  runAccident(result, output) {
    let results = null;
    switch (this.data.accident) {
      case "pee":
        results = result.pee();
        break;
      case "poo":
        results = result.poo();
        break;
      case "both":
        results = result.both();
        break;
    }
    delete this.data.accident;
    if (results) {
      if (!this.runResults(results, output)) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param {SavingThrowResult} result
   * @param {Console} output
   */
  runSavingThrow(result, output) {
    const saveValue = this.data.character.get(result.savingThrow());
    const d20 = 1 + Math.floor(Math.random() * 20);
    if (saveValue + d20 < result.dc()) {
      if (!this.runResults(result.results(), output)) {
        return false;
      }
    }
    return true;
  }
}

export default ExecuteEvent;
