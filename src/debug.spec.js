import debug from './debug';

describe('Debug message logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    console.debug.mockRestore();
  });

  it('will do nothing if debug mode not set', () => {
    // Arrange
    delete process.env.APP_LOG_DEBUG;

    // Act
    debug('foo', 3);

    // Assert
    expect(console.debug).not.toHaveBeenCalled();
  });

  it('will log if debug mode set', () => {
    // Arrange
    process.env.APP_LOG_DEBUG = '1';

    // Act
    debug('foo', 3);

    // Assert
    expect(console.debug).toHaveBeenCalledTimes(1);
    expect(console.debug).toHaveBeenCalledWith('foo', 3);
  });
});
