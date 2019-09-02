import EventTask from '../commands/task/event-task';
import runOneTask from '../commands/task/task';

class EventLoop {
  static async run({
    maxFloorCount = 15,
    character,
    tags = {},
    localeId = 'en-US',
    eventIds = [],
  }) {
    /** @type {import('../commands/task/task').TaskContext} */
    let state = {
      character,
      tags,
      localeId,
      queue: [],
      floorIndex: 0,
    };
    while (state.floorIndex < maxFloorCount) {
      const eventId = eventIds.shift();
      const event = new EventTask(eventId);
      state = event.run(state);

      while (state.queue.length > 0) {
        // Each loop iteration changes state, so the await has to be in the loop.
        // eslint-disable-next-line no-await-in-loop
        const { output, inputRequest, ...nextState } = await runOneTask(state);
        state = nextState;
        if (output && output.length) {
          output.forEach((line) => console.log(line));
        }
        if (inputRequest && inputRequest.length) {
          console.debug('TODO: Accept user input');
          state.inputIndex = 0;
        }
      }
    }
  }
}

export default EventLoop;
