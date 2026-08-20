/**
 * State store and local caching for Grammar Reviewer
 */

let memorySession = null;

/**
 * Loads the active review session.
 * @returns {object|null}
 */
export function getActiveSession() {
  return memorySession;
}

/**
 * Sets or updates the active review session in memory.
 * @param {object} session
 */
export function setActiveSession(session) {
  memorySession = session;
}

/**
 * Clears the active review session.
 */
export function clearActiveSession() {
  memorySession = null;
}
