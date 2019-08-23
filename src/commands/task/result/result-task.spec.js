import debug from '../../../debug';
import ResultTask from './result-task';
import Result from '../../../models/result/result';
import MessageResult from '../../../models/result/message-result';

jest.mock('../../../debug');

describe('Task for an individual result', () => {
  it('will write debug message and do no-op for unsupported result type', () => {
    // Arrange
    const task = new ResultTask(new Result({ type: 'notSupported' }));
    const state = { queue: [jest.fn()] };

    // Act
    const nextState = task.run(state);

    // Assert
    expect(debug).toHaveBeenCalledWith(
      'Result type not supported: notSupported',
    );
    expect(nextState.queue).toHaveLength(1);
  });

  it('will run the specific task type', () => {
    // Arrange
    const task = new ResultTask(
      new MessageResult({ type: 'message', message: 'Foo' }),
    );
    const state = { queue: [jest.fn()] };

    // Act
    const nextState = task.run(state);

    // Assert
    expect(nextState.queue).toHaveLength(1);
    expect(nextState.output).toEqual(['Foo']);
  });
});
