import RunResultCollection from "./run-result-collection";

/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 * @typedef {import('../models/result/effect-result').default} EffectResult
 * @typedef {Object} RunEffectResultData
 * @property {Character} character
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * @property {string} eventId
 * @property {string} localeId
 * @property {Console} output
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
    const { result, ...originalData } = this.data;
    const { character, statusCollection } = originalData;
    let data = {
      ...originalData,
      character: character.apply(result.data.name, result.data.value, events)
    };
    for (const index in events) {
      const event = events[index];
      // Execute apply events for the newly applied status
      const status = statusCollection.get(event.name);
      if (status) {
        for (const effectIndex in status.effect()) {
          const effect = status.effect()[effectIndex];
          if (effect.event === "apply") {
            data = new RunResultCollection({
              ...data,
              results: effect.results
            }).run();
          }
        }
      }
      // Execute onStatus events
      const onStatusList = this.data.statusCollection.getOnStatus(event.name);
      for (const onStatusIndex in onStatusList) {
        const onStatus = onStatusList[onStatusIndex];
        // TODO: Use expression comparison
        if (event.value === onStatus.value) {
          data = new RunResultCollection({
            ...data,
            results: onStatus.results
          }).run();
        }
      }
    }
    return {
      ...data,
      continue: true
    };
  }
}

export default RunEffectResult;
