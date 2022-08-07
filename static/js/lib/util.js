/**
 * @file Helper functions shared across modules.
 * @author Jordan Mann
 */

/**
 * Wait for the next event loop cycle, letting any pending messages complete.
 *
 * @returns {Promise<undefined>} A Promise which will resolve on the next event loop cycle.
 */
export function nextEventLoop() {
  return new Promise((res) => setTimeout(res));
}
