import { Instance as Events } from '../../models/event/event-collection';
import ResultTask from './result-task';
import debug from '../../debug';

/**
 * @typedef {import('./task').TaskInput} TaskInput
 * @typedef {import('./task').TaskOutput} TaskOutput
 */

class EventTask {
  /**
   * Creates a task to execute an event.
   * @param {string} eventId
   */
  constructor(eventId) {
    this.eventId = eventId;
  }

  /**
   * @param {TaskInput} state
   * @returns {TaskOutput}
   */
  run(state) {
    const event = Events().get(this.eventId);
    if (!event) {
      debug(`Event ID not supported: ${this.eventId}`);
      return state;
    }
    const queue = state.queue || [];

    return {
      ...state,
      queue: [
        ...event
          .results()
          .items()
          .map((result) => new ResultTask(result).run),
        ...queue,
      ],
    };
  }
}

export default EventTask;
