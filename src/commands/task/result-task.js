import debug from '../../debug';

/**
 * @typedef {import('../../models/result/result').default} Result
 * @typedef {import('./task').TaskInput} TaskInput
 * @typedef {import('./task').TaskOutput} TaskOutput
 */

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
    debug(`Result type not supported: ${this.result.type()}`);
    return state;
  };
}

export default ResultTask;
