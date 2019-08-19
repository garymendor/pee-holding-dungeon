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
 * @property {Console} output
 */

class ExecuteEvent {
  /**
   *
   * @param {ExecuteEventData} data
   */
  constructor(data) {
    this.data = {
      output: console,
      ...data
    };
  }

  run() {
    const event = this.data.eventCollection.get(this.data.eventId);
    if (!event) {
      return;
    }

    const description = event.description(this.data.localeId);
    if (description) {
      this.data.output.log(description);
    }
    if (this.runResults(event.results())) {
      // Execute floor-end status events
      for (const statusId in this.data.character.data.status) {
        const status = this.data.statusCollection.get(statusId);
        if (status) {
          for (const effectIndex in status.effect()) {
            const effect = status.effect()[effectIndex];
            if (effect.event === "floor-end") {
              this.runResults(effect.results);
            }
          }
        }
      }
    }
    return this.data;
  }

  /**
   * Runs a collection of events.
   * @param {ResultCollection} results
   */
  runResults(results) {
    for (const result of results.items()) {
      if (!this.runResult(result)) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param {Result} result
   */
  runResult(result) {
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
      this.data.output.error(`Not supported: ${result.type()}`);
      return true;
    }
    return runResultMethod.call(this, result);
  }

  /**
   *
   * @param {EventResult} result
   */
  runEvent(result) {
    const nextEvent = new ExecuteEvent({
      ...this.data,
      eventId: result.event()
    });
    this.data = nextEvent.run();
    return false;
  }

  /**
   * @param {EffectResult} result
   */
  runEffect(result) {
    const events = [];
    this.data.character = this.data.character.apply(
      result.data.name,
      result.data.value,
      events
    );
    for (const index in events) {
      const event = events[index];
      // Execute apply events for the newly applied status
      const status = this.data.statusCollection.get(event.name);
      if (status) {
        for (const effectIndex in status.effect()) {
          const effect = status.effect()[effectIndex];
          if (effect.event === "apply") {
            this.runResults(effect.results);
          }
        }
      }
      // Execute onStatus events
      const onStatusList = this.data.statusCollection.getOnStatus(event.name);
      for (const onStatusIndex in onStatusList) {
        const onStatus = onStatusList[onStatusIndex];
        // TODO: Use expression comparison
        if (event.value === onStatus.value) {
          this.runResults(onStatus.results);
        }
      }
    }
    return true;
  }

  /**
   * @param {MessageResult} result
   */
  runMessage(result) {
    this.data.output.log(result.message(this.data.localeId));
    return true;
  }

  /**
   * @param {ChoiceResult} result
   */
  runChoice(result) {
    const choices = [];
    // TODO: Localize
    this.data.output.log("Choose one of the following actions:");
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
   */
  runStatCheck(result) {
    const actualValue = this.data.character.get(result.name());
    if (result.compare(actualValue)) {
      if (!this.runResults(result.results())) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param {AccidentCheckResult} result
   */
  runAccidentCheck(result) {
    this.data.accident = result.compare(this.data.character);
    if (this.data.accident) {
      if (!this.runResults(result.results())) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param {AccidentResult} result
   */
  runAccident(result) {
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
      if (!this.runResults(results)) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param {SavingThrowResult} result
   */
  runSavingThrow(result) {
    const saveValue = this.data.character.get(result.savingThrow());
    const d20 = 1 + Math.floor(Math.random() * 20);
    if (saveValue + d20 < result.dc()) {
      if (!this.runResults(result.results())) {
        return false;
      }
    }
    return true;
  }
}

export default ExecuteEvent;
