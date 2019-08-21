import RunResultCollection from "./run-result-collection";

/**
 * @typedef {import('./execute-event').ExecuteEventData} ExecuteEventData
 */

/**
 * @typedef {Object} TriggerStatusEventFields
 * @property {Object<string,boolean>} statusIds
 * The set of status IDs to check and their values. If null, will use the character's current status.
 * @property {string} triggerId
 * The gameplay flow event trigger:
 * * `"floor-start"` - Triggers when a floor starts. Also triggers in reverse when a floor ends.
 * * `"floor-end"` - Triggers when a floor ends.
 * * `"apply"` - Triggers when a status effect is first applied.
 */

/**
 * @typedef {ExecuteEventData & TriggerStatusEventFields} TriggerStatusEventRequest
 */

/**
 * @typedef {Object} TriggerStatusEventResponse
 * @property {Character} character
 */

class TriggerStatusEvent {
  /**
   * Applies any status effect behaviors applicable to a particular
   * stage of gameplay flow.
   * @param {TriggerStatusEventRequest} request
   * @returns {TriggerStatusEventResponse}
   */
  async run(request) {
    const {
      character,
      statusCollection,
      triggerId,
      statusIds = character.data.status
    } = request;
    let newCharacter = character;

    for (const statusId in statusIds) {
      const statusValue = statusIds[statusId];
      const status = statusCollection.get(statusId);
      if (!status) {
        continue;
      }
      const results = status.effect()[triggerId];
      if (!results) {
        continue;
      }

      const runResult = await new RunResultCollection({
        ...request,
        results,
        invert: !statusValue
      }).run();
      newCharacter = runResult.character;
    }

    return { character: newCharacter };
  }
}

export default TriggerStatusEvent;
