/**
 * Writes debug information.
 * @param  {...any} args Debug content to log.
 */
export default function (...args) {
  if (process.env.APP_LOG_DEBUG) {
    // eslint-disable-next-line no-console
    console.debug(...args);
  }
}
