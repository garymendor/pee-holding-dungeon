import RunEffectResult from "./run-effect-result";
import RunEventResult from "./run-event-result";
import RunMessageResult from "./run-message-result";
import RunChoiceResult from "./run-choice-result";
import RunStatCheckResult from "./run-stat-check-result";
import RunAccidentCheckResult from "./run-accident-check-result";
import RunAccidentResult from "./run-accident-result";
import RunSavingThrowResult from "./run-saving-throw-result";

/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/result-collection').default} ResultCollection
 * @typedef {import('../models/result/result').default} Result
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
   * @param {ExecuteEventData} data
   */
  runEffect(data) {
    return new RunEffectResult(data).run();
  }

  /**
   * @param {ExecuteEventData} data
   */
  runMessage(data) {
    return new RunMessageResult(data).run();
  }

  /**
   * @param {ExecuteEventData} data
   */
  runChoice(data) {
    return new RunChoiceResult(data).run();
  }

  /**
   * @param {ExecuteEventData} data
   */
  runStatCheck(data) {
    return new RunStatCheckResult(data).run();
  }

  /**
   * @param {ExecuteEventData} data
   */
  runAccidentCheck(data) {
    return new RunAccidentCheckResult(data).run();
  }

  /**
   * @param {ExecuteEventData} data
   */
  runAccident(data) {
    return new RunAccidentResult(data).run();
  }

  /**
   * @param {ExecuteEventData} data
   */
  runSavingThrow(data) {
    return new RunSavingThrowResult(data).run();
  }
}

export default ExecuteEvent;
