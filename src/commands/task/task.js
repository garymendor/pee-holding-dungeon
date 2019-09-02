/**
 * @typedef {import('../../models/character/character').default} Character
 */

/**
 * The context in which tasks run.
 * @typedef {Object} TaskContext
 * @property {Character} character
 * A player character.
 * @property {number} floorIndex
 * What floor the character is on (0 means first floor).
 * @property {Object<string,number>} tags
 * Tags which apply to the current situation. Whenever a tag is applied,
 * its number is incremented; when it is unapplied, the number is decremented.
 * @property {number=} inputIndex
 * Input received from the user, or nothing if no input has been received.
 * @property {string} localeId
 * The locale ID for the user.
 * @property {TaskRunner[]} queue
 * The queue of tasks to run after the current task.
 */

/**
 * @typedef {Object} TaskInputFields
 * @property {number=} inputIndex
 * Input received from the user, or nothing if no input has been received.
 */

/**
 * @typedef {Object} TaskOutputFields
 * @property {string[]} output
 * A collection of messages to display to the user once the task is completed.
 * @property {string[]} inputRequest
 * If present, the current task cannot be executed unless `inputIndex`
 * is supplied in the input. Consists of a collection of string prompts from which
 * the user can choose.
 */

/**
 * The input object supplied to a TaskRunner.
 * @typedef {TaskContext & TaskInputFields} TaskInput
 */

/**
 * The output object returned from a TaskRunner.
 * @typedef {TaskContext & TaskOutputFields} TaskOutput
 */

/**
 * A function that attempts to apply a particular operation to
 * a task context. All task runners should pass through any fields they
 * do not recognize.
 * @typedef {(state:TaskInput)=>Promise<TaskOutput>} TaskRunner
 */

/**
 * Runs a single task in the queue of a state.
 * @param {TaskInput} state The input state.
 * @returns {Promise<TaskOutput>}
 * The result of running the first task in the queue.
 */
async function runOneTask(state) {
  if (!state || !state.queue || !state.queue.length) {
    return state;
  }

  const [nextTask, ...remainingQueue] = state.queue;
  const nextState = { ...state, queue: remainingQueue };
  if (!nextTask) {
    return nextState;
  }
  return nextTask(nextState);
}

export default runOneTask;
