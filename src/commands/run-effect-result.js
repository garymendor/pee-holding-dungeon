/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/result-collection').default} ResultCollection
 * @typedef {import('./execute-event').default} ExecuteEvent
 * @typedef {import('../models/result/effect-result').default} EffectResult
 * @typedef {Object} RunEffectResultData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
 * @property {ExecuteEvent} executeEventCommand
 * @property {EffectResult} result
 */

class RunEffectResult {
  /**
   * Creates an instance of `RunEffectResult`.
   * @param {RunEffectResultData} data
   */
  constructor(data) {
    /**
     * @type {RunEffectResultData}
     */
    this.data = data;
  }

  /**
   * Runs the command.
   * @returns {import('./execute-event').ExecuteEventData}
   */
  run() {
    /**
     * @type {{name:string,value:any}[]}
     */
    const events = [];
    const { result, character, executeEventCommand } = this.data;
    this.data = {
      ...this.data,
      character: character.apply(result.data.name, result.data.value, events)
    };
    for (const index in events) {
      const event = events[index];
      // Execute apply events for the newly applied status
      const status = this.data.statusCollection.get(event.name);
      if (status) {
        for (const effectIndex in status.effect()) {
          const effect = status.effect()[effectIndex];
          if (effect.event === "apply") {
            executeEventCommand.runResults(effect.results);
          }
        }
      }
      // Execute onStatus events
      const onStatusList = this.data.statusCollection.getOnStatus(event.name);
      for (const onStatusIndex in onStatusList) {
        const onStatus = onStatusList[onStatusIndex];
        // TODO: Use expression comparison
        if (event.value === onStatus.value) {
          executeEventCommand.runResults(onStatus.results);
        }
      }
    }
    return {
      ...this.data,
      continue: true
    };
  }
}

export default RunEffectResult;
