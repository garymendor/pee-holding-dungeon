import ResultTask from './result-task';

/**
 * @typedef {import('../../../models/result/choice-result').default} ChoiceResult
 * @typedef {import('../task').TaskInput} TaskInput
 * @typedef {import('../task').TaskOutput} TaskOutput
 */

class ChoiceTask {
  /**
   * @param {ChoiceResult} result
   */
  constructor(result) {
    this.result = result;
  }

  /**
   * @param {TaskInput} state
   * @returns {TaskOutput}
   */
  run(state) {
    const { localeId } = state;
    const { inputIndex, ...nextState } = state;
    if (typeof inputIndex !== 'number') {
      return {
        ...nextState,
        inputRequest: this.result
          .choices()
          .map((choice) => choice.description(localeId)),
      };
    }

    const choice = this.result.choices()[inputIndex];

    return {
      ...nextState,
      queue: [
        ...choice
          .results()
          .items()
          .map((result) => new ResultTask(result)),
        ...nextState.queue,
      ],
    };
  }
}

export default ChoiceTask;
