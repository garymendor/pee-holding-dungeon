import RunResultCollection from "./run-result-collection";

/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/stat-check-result').default} SavingThrowResult
 * @typedef {Object} RunSavingThrowResultData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
 * @property {SavingThrowResult} result
 */

class RunSavingThrowResult {
  /**
   * @param {RunSavingThrowResultData} data
   */
  constructor(data) {
    /**
     * @type {RunSavingThrowResultData}
     */
    this.data = data;
  }

  /**
   * Runs the command.
   * @returns {import('./execute-event').ExecuteEventData}
   */
  run() {
    const { result, ...data } = this.data;
    const { character } = data;
    const saveValue = character.get(result.savingThrow());
    const d20 = 1 + Math.floor(Math.random() * 20);
    if (saveValue + d20 < result.dc()) {
      return new RunResultCollection({
        ...data,
        results: result.results()
      }).run();
    }
    return {
      ...data,
      continue: true
    };
  }
}

export default RunSavingThrowResult;
