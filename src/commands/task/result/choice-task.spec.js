import ResultTask from './result-task';
import ChoiceTask from './choice-task';
import ChoiceResult from '../../../models/result/choice-result';
import MessageResult from '../../../models/result/message-result';

jest.mock('./result-task');

describe('Task for ChoiceResult', () => {
  const choiceResult = new ChoiceResult({
    choices: [
      { description: 'Choice 1', results: { message: 'foo' } },
      { description: 'Choice 2', results: { message: 'bar' } },
    ],
  });

  it('will request input if none is supplied', () => {
    // Arrange
    const state = { foo: 'bar', queue: [jest.fn()] };
    const task = new ChoiceTask(choiceResult);

    // Arrange
    const nextState = task.run(state);

    // Assert
    expect(nextState).toEqual({
      foo: 'bar',
      queue: state.queue,
      inputRequest: ['Choice 1', 'Choice 2'],
    });
  });

  it.each([[0, 'foo'], [1, 'bar']])(
    'will prepend the expected results to the queue',
    async (inputIndex, expectedMessage) => {
      // Arrange
      const state = { foo: 'bar', queue: [jest.fn()], inputIndex };
      const task = new ChoiceTask(choiceResult);
      const taskFunc = jest.fn();
      ResultTask.mockImplementation(() => ({ run: taskFunc }));

      // Arrange
      const nextState = task.run(state);

      // Assert
      expect(nextState).toEqual({
        foo: 'bar',
        queue: [taskFunc, state.queue[0]],
      });
      expect(ResultTask).toHaveBeenCalledTimes(1);
      expect(ResultTask).toHaveBeenCalledWith(expect.any(MessageResult));
      /** @type {MessageResult} */
      const messageResult = ResultTask.mock.calls[0][0];
      expect(messageResult.message()).toEqual(expectedMessage);
    },
  );
});
