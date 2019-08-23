import task from './task';

describe('Task base creator', () => {
  it('will create a no-op task', () => {
    // Arrange
    const newTask = task();
    const state = { foo: 'bar' };

    // Act
    const newState = newTask(state);

    // Assert
    expect(newState).toBe(state);
  });
});
