import { Instance as Events } from '../../models/event/event-collection';
import ResultTask from './result/result-task';
import debug from '../../debug';
import EventTask from './event-task';
import Result from '../../models/result/result';

jest
  .mock('../../models/event/event-collection')
  .mock('./result/result-task')
  .mock('../../debug');

describe('A task for an event', () => {
  const eventCollection = {
    get: jest.fn(),
    getRandomEventId: jest.fn(),
  };
  ResultTask.mockImplementation((result) => ({
    run: jest.fn(() => result),
  }));

  beforeEach(() => {
    Events.mockReturnValue(eventCollection);
  });

  it('will select a random event ID if none is passed in', () => {
    // Arrange
    eventCollection.getRandomEventId.mockReturnValue('Random event ID');

    // Act
    const task = new EventTask();

    // Assert
    expect(task.eventId).toEqual('Random event ID');
    expect(eventCollection.getRandomEventId).toHaveBeenCalledTimes(1);
    expect(eventCollection.getRandomEventId).toHaveBeenCalledWith('floor');
  });

  it('will write debug message and do no-op for unsupported event type', () => {
    // Arrange
    const eventId = 'Unsupported event ID';
    const task = new EventTask(eventId);
    const state = {};

    // Act
    const newState = task.run(state);

    // Assert
    expect(debug).toHaveBeenCalledWith(`Event ID not supported: ${eventId}`);
    expect(newState).toBe(state);
  });

  it('will not include an output element if the event has no description', () => {
    // Arrange
    eventCollection.get.mockReturnValue({
      description: jest.fn(),
      results: jest.fn(() => ({ items: jest.fn(() => []) })),
    });
    const task = new EventTask('Event ID');
    const state = { character: { name: 'Fred' } };

    // Act
    const newState = task.run(state);

    // Assert
    expect(newState.output).toHaveLength(0);
  });

  it('will include an output element if the event has a description', () => {
    // Arrange
    eventCollection.get.mockReturnValue({
      description: jest.fn(() => 'test message'),
      results: jest.fn(() => ({ items: jest.fn(() => []) })),
    });
    const task = new EventTask('Event ID');
    const state = { character: { name: 'Fred' } };

    // Act
    const newState = task.run(state);

    // Assert
    expect(newState.output).toEqual(['test message']);
  });

  it('will prepend the event results to an existing queue for supported event type', () => {
    // Arrange
    const results = [new Result({ type: 'foo' }), new Result({ type: 'bar' })];
    eventCollection.get.mockReturnValue({
      description: jest.fn(),
      results: jest.fn(() => ({ items: jest.fn(() => results) })),
    });
    const task = new EventTask('Event ID');
    const queueNext = { name: 'Barney' };
    const queueFn = jest.fn(() => queueNext);
    const state = { character: { name: 'Fred' }, queue: [queueFn] };

    // Act
    const newState = task.run(state);

    // Assert
    expect(newState.character).toBe(state.character);
    expect(newState.queue).toHaveLength(4);
    const actualQueueFn = newState.queue.pop();
    expect(actualQueueFn).toBe(queueFn);
    newState.queue.pop(); // Pop the floor-change task
    expect(newState.queue.map((fn) => fn())).toEqual(results);
  });

  it('will create a new queue with the event results for supported event type', () => {
    // Arrange
    const results = [new Result({ type: 'foo' }), new Result({ type: 'bar' })];
    eventCollection.get.mockReturnValue({
      description: jest.fn(),
      results: jest.fn(() => ({ items: jest.fn(() => results) })),
    });
    const task = new EventTask('Event ID');
    const state = { character: { name: 'Fred' } };

    // Act
    const newState = task.run(state);

    // Assert
    expect(newState.character).toBe(state.character);
    expect(newState.queue).toHaveLength(3);
    const floorChangeRunner = newState.queue.pop();
    expect(newState.queue.map((fn) => fn())).toEqual(results);

    // Act
    const floorChangeResult = floorChangeRunner({ floorIndex: 0, foo: 'bar' });

    // Assert
    expect(floorChangeResult).toEqual({ floorIndex: 1, foo: 'bar' });
  });
});
