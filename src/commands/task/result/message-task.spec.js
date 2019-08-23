import MessageTask from './message-task';
import MessageResult from '../../../models/result/message-result';

describe('Task for MessageResult', () => {
  it('will include the message content in the output', () => {
    // Arrange
    const messageResult = new MessageResult({ message: 'Sample message' });
    const task = new MessageTask(messageResult);
    const state = { localeId: 'en-US' };

    // Act
    const nextState = task.run(state);

    // Assert
    expect(nextState.output).toEqual(['Sample message']);
  });
});
