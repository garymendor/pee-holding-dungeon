import RunResultCollection from "./run-result-collection";

/**
 * @typedef {import('../models/character/character').default} Character
 * @typedef {import('../models/event/event-collection').default} EventCollection
 * @typedef {import('../models/status/status-collection').default} StatusCollection
 */

/**
 * @typedef {Object} TriggerStatusEventRequest
 * @property {Character} character
 * The character whose status effects are being triggered.
 * @property {EventCollection} eventCollection
 * @property {StatusCollection} statusCollection
 * The status effect configuration.
 * @property {string} localeId
 * @property {Console} output
 * @property {{name:string,value:boolean?}} statusIds
 * The set of status IDs to check and their values. If null, will use the character's current status.
 * @property {string} triggerId
 * The gameplay flow event trigger:
 * * `"floor-start"` - Triggers when a floor starts. Also triggers in reverse when a floor ends.
 * * `"floor-end"` - Triggers when a floor ends.
 * * `"apply"` - Triggers when a status effect is first applied.
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
      if (!statusIds[statusId]) {
        continue;
      }
      const status = statusCollection.get(statusId);
      if (status) {
        // TODO: Refacter status effect triggers as a dictionary
        for (const effectIndex in status.effect()) {
          const effect = status.effect()[effectIndex];
          if (effect.trigger === triggerId) {
            const runResult = await new RunResultCollection({
              ...request,
              results: effect.results
            }).run();
            newCharacter = runResult.character;
          }
        }
      }
    }

    return { character: newCharacter };
  }
}

export default TriggerStatusEvent;
