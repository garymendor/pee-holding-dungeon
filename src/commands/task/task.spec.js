import runOneTask from './task';

describe('Task runner function', () => {
  it('will pass through state with no queue', async () => {
    // Arrange
    const state = { foo: 'bar' };

    // Act
    const newState = await runOneTask(state);

    // Assert
    expect(newState).toBe(state);
  });

  it('will dequeue empty task and return appropriate state', async () => {
    // Arrange
    const nextTaskAfter = jest.fn();
    const state = { foo: 'bar', queue: [null, nextTaskAfter] };

    // Act
    const newState = await runOneTask(state);

    // Assert
    expect(newState).toEqual({ foo: 'bar', queue: [nextTaskAfter] });
  });

  it('will dequeue task and return its return value', async () => {
    // Arrange
    const nextTaskResult = { foo: 'baz', queue: [] };
    const nextTask = jest.fn().mockResolvedValue(nextTaskResult);
    const nextTaskAfter = jest.fn();
    const state = { foo: 'bar', queue: [nextTask, nextTaskAfter] };

    // Act
    const newState = await runOneTask(state);

    // Assert
    expect(newState).toBe(nextTaskResult);
    expect(nextTask).toHaveBeenCalledWith({
      foo: 'bar',
      queue: [nextTaskAfter],
    });
  });
});
