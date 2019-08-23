/**
 * @typedef {import('../../models/character/character').default} Character
 */

/**
 * The context in which tasks run.
 * @typedef {Object} TaskContext
 * @property {Character} character
 * A player character.
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
 * a task context.
 * @typedef {(state:TaskInput)=>Promise<TaskOutput>} TaskRunner
 */

/**
 * Creates an empty task runner.
 * @returns {TaskRunner}
 */
function task() {
  return (state) => state;
}

export default task;
