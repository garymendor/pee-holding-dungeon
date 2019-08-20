import RunResultCollection from "./run-result-collection";
import TriggerStatusEvent from "./trigger-status-event";
import ApplyCharacterChange from "./apply-character-change";

/**
 * @typedef {import('./execute-event').ExecuteEventData} ExecuteEventData
 * @typedef {import('../models/result/effect-result').default} EffectResult
 * @typedef {ExecuteEventData & {result:EffectResult}} RunEffectResultData
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
   * @returns {Promise<import('./execute-event').ExecuteEventData>}
   */
  async run() {
    const { result, ...originalData } = this.data;
    const { character } = originalData;
    const {
      character: newCharacter,
      statusChanges
    } = new ApplyCharacterChange().run({
      character,
      name: result.data.name,
      value: result.data.value
    });
    let data = {
      ...originalData,
      character: newCharacter
    };

    ({ character: data.character } = await new TriggerStatusEvent().run({
      ...data,
      statusIds: statusChanges,
      triggerId: "apply"
    }));

    for (const index in statusChanges) {
      const event = statusChanges[index];
      // Execute onStatus events
      const onStatusList = this.data.statusCollection.getOnStatus(event.name);
      for (const onStatusIndex in onStatusList) {
        const onStatus = onStatusList[onStatusIndex];
        // TODO: Use expression comparison
        if (character.get(onStatus.name) && event.value === onStatus.value) {
          data = await new RunResultCollection({
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
