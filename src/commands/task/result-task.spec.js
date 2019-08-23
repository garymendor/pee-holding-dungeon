import debug from '../../debug';
import ResultTask from './result-task';
import Result from '../../models/result/result';

jest.mock('../../debug');

describe('Task for an individual result', () => {
  it('will write debug message and do no-op for unsupported result type', () => {
    // Arrange
    const task = new ResultTask(new Result({ type: 'notSupported' }));
    const input = { queue: [jest.fn()] };

    // Act
    const output = task.run(input);

    // Assert
    expect(debug).toHaveBeenCalledWith(
      'Result type not supported: notSupported',
    );
    expect(output.queue).toHaveLength(1);
  });
});
