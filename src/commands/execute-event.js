import readlineSync from "readline-sync";
import RunEffectResult from "./run-effect-result";
import RunEventResult from "./run-event-result";
import RunMessageResult from "./run-message-result";
import RunChoiceResult from "./run-choice-result";

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
 * @property {boolean} continue
 */

class ExecuteEvent {
  /**
   *
   * @param {ExecuteEventData} data
   */
  constructor(data) {
    /**
     * @type {ExecuteEventData}
     */
    this.data = {
      output: console,
      ...data
    };
  }

  /**
   * @returns {ExecuteEventData}
   */
  run() {
    const event = this.data.eventCollection.get(this.data.eventId);
    if (!event) {
      return this.data;
    }

    const description = event.description(this.data.localeId);
    if (description) {
      this.data.output.log(description);
    }
    let data = this.runResults(event.results(), this.data);
    if (data.continue) {
      // Execute floor-end status events
      for (const statusId in data.character.data.status) {
        const status = data.statusCollection.get(statusId);
        if (status) {
          for (const effectIndex in status.effect()) {
            const effect = status.effect()[effectIndex];
            if (effect.event === "floor-end") {
              data = this.runResults(effect.results, data);
            }
          }
        }
      }
    }
    return data;
  }

  /**
   * Runs a collection of events.
   * @param {ResultCollection} results
   */
  runResults(results, data) {
    let newData = data;
    for (const result of results.items()) {
      newData = this.runResult(result, newData);
      if (!newData.continue) {
        return newData;
      }
    }
    return newData;
  }

  /**
   * @param {Result} result
   * @param {ExecuteEventData} data
   */
  runResult(result, data) {
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
      return this.data;
    }
    return runResultMethod.call(this, {
      ...data,
      result,
      executeEventCommand: this
    });
  }

  /**
   * @param {ExecuteEventData} data
   */
  runEvent(data) {
    return new RunEventResult(data).run();
  }

  /**
   * @param {EffectResult} result
   */
  runEffect(data) {
    return new RunEffectResult(data).run();
  }

  /**
   * @param {MessageResult} result
   */
  runMessage(data) {
    return new RunMessageResult(data).run();
  }

  /**
   * @param {ChoiceResult} result
   */
  runChoice(data) {
    return new RunChoiceResult(data).run();
  }

  /**
   * @param {StatCheckResult} result
   */
  runStatCheck(data) {
    const { result } = data;
    const actualValue = data.character.get(result.name());
    if (result.compare(actualValue)) {
      return this.runResults(result.results(), data);
    }
    return {
      ...this.data,
      continue: true
    };
  }

  /**
   * @param {AccidentCheckResult} result
   */
  runAccidentCheck(data) {
    const { result } = data;
    const accident = result.compare(data.character);
    if (accident) {
      return this.runResults(result.results(), { ...data, accident });
    }
    return { ...data, continue: true };
  }

  /**
   * @param {AccidentResult} result
   */
  runAccident(data) {
    const { result } = data;
    let results = null;
    switch (data.accident) {
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
    if (results) {
      return this.runResults(results, { ...data, accident: null });
    }
    return {
      ...data,
      accident: null,
      continue: true
    };
  }

  /**
   * @param {SavingThrowResult} result
   */
  runSavingThrow(data) {
    const { result } = data;
    const saveValue = data.character.get(result.savingThrow());
    const d20 = 1 + Math.floor(Math.random() * 20);
    if (saveValue + d20 < result.dc()) {
      return this.runResults(result.results(), data);
    }
    return {
      ...data,
      continue: true
    };
  }
}

export default ExecuteEvent;
