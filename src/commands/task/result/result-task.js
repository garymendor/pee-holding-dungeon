import debug from '../../../debug';
import ChoiceTask from './choice-task';
import MessageTask from './message-task';

/**
 * @typedef {import('../../../models/result/result').default} Result
 * @typedef {import('../task').TaskInput} TaskInput
 * @typedef {import('../task').TaskOutput} TaskOutput
 */

/**
 * @type {Object<string,ResultTask>}
 */
const TaskClasses = {
  choice: ChoiceTask,
  message: MessageTask,
};

class ResultTask {
  /**
   *
   * @param {Result} result
   */
  constructor(result) {
    this.result = result;
  }

  /**
   * @param {TaskInput} state
   * @returns {TaskOutput}
   */
  run = (state) => {
    const type = this.result.type();
    const SpecificTask = TaskClasses[type];
    if (!SpecificTask) {
      debug(`Result type not supported: ${this.result.type()}`);
      return state;
    }
    return new SpecificTask(this.result).run(state);
  };
}

export default ResultTask;
