import LocalizableString from '../localizable-string';
import Result from './result';

class MessageResult extends Result {
  constructor(data) {
    super(data);
    this.data.message = new LocalizableString(data.message);
  }

  /**
   * Gets the message to display.
   * @param {string} localeId
   * @returns {string}
   */
  message(localeId) {
    return this.data.message.get(localeId);
  }
}

export default MessageResult;
