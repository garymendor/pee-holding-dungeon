import { Instance as Events } from '../../models/event/event-collection';
import ResultTask from './result/result-task';
import debug from '../../debug';

/**
 * @typedef {import('./task').TaskInput} TaskInput
 * @typedef {import('./task').TaskOutput} TaskOutput
 */

class EventTask {
  /**
   * Creates a task to execute an event.
   * @param {string=} eventId The event ID for the floor or null for a random event.
   */
  constructor(eventId) {
    this.eventId = eventId || Events().getRandomEventId('floor');
  }

  /**
   * Creates a mini-task to increment the floor number.
   */
  static floorChangeTask() {
    return (state) => ({ ...state, floorIndex: state.floorIndex ? state.floorIndex + 1 : 1 });
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
    const output = [];
    const message = event.description(state.localeId);
    if (message) {
      output.push(message);
    }

    return {
      ...state,
      queue: [
        ...event
          .results()
          .items()
          .map((result) => new ResultTask(result).run),
        EventTask.floorChangeTask(),
        ...queue,
      ],
      output,
    };
  }
}

export default EventTask;
