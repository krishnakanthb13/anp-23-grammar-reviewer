/**
 * @file usageTracker.js
 * @description Safe Amplenote-persisted AI usage tracking module.
 * Tracks today and lifetime success/failure request counts globally and per-provider.
 */

import { PROVIDERS } from "../constants.js";

export const USAGE_SETTING_KEY = "AI Usage Stats";

/**
 * Returns today's ISO date string (YYYY-MM-DD).
 * @returns {string}
 */
export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Creates a clean default provider usage bucket.
 * @returns {{ today: { success: number, failed: number }, lifetime: { success: number, failed: number } }}
 */
function createProviderBucket() {
  return {
    today: { success: 0, failed: 0 },
    lifetime: { success: 0, failed: 0 }
  };
}

/**
 * Generates default empty stats object for all known providers.
 * @returns {object}
 */
export function getDefaultUsageStats() {
  const providers = {};
  for (const p of Object.values(PROVIDERS)) {
    providers[p] = createProviderBucket();
  }
  return {
    version: 1,
    date: getTodayDateString(),
    today: { success: 0, failed: 0 },
    lifetime: { success: 0, failed: 0 },
    providers
  };
}

let memoryUsageStats = null;

/**
 * Clears in-memory cached usage statistics (for testing/resets).
 */
export function clearMemoryUsageStats() {
  memoryUsageStats = null;
}

/**
 * Safely parses and normalizes usage stats from Amplenote plugin settings or memory cache.
 * Automatically performs daily rollover if the date has changed.
 * 
 * @param {object} [app]
 * @returns {object} Normalized usage stats
 */
export function getUsageStats(app) {
  let stats = null;
  const raw = app?.settings?.[USAGE_SETTING_KEY];

  if (raw && typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw.trim());
      if (parsed && typeof parsed === "object") {
        stats = parsed;
      }
    } catch {
      stats = null;
    }
  } else if (raw && typeof raw === "object") {
    stats = raw;
  }

  if (!stats && memoryUsageStats) {
    stats = JSON.parse(JSON.stringify(memoryUsageStats));
  }

  if (!stats) {
    stats = getDefaultUsageStats();
  }

  // Ensure structure validity
  if (!stats.providers || typeof stats.providers !== "object") {
    stats.providers = {};
  }
  if (!stats.today) stats.today = { success: 0, failed: 0 };
  if (!stats.lifetime) stats.lifetime = { success: 0, failed: 0 };

  // Ensure all known providers exist
  for (const p of Object.values(PROVIDERS)) {
    if (!stats.providers[p]) {
      stats.providers[p] = createProviderBucket();
    } else {
      if (!stats.providers[p].today) stats.providers[p].today = { success: 0, failed: 0 };
      if (!stats.providers[p].lifetime) stats.providers[p].lifetime = { success: 0, failed: 0 };
    }
  }

  // Daily rollover check
  const todayStr = getTodayDateString();
  if (stats.date !== todayStr) {
    stats.date = todayStr;
    stats.today = { success: 0, failed: 0 };
    for (const key of Object.keys(stats.providers)) {
      stats.providers[key].today = { success: 0, failed: 0 };
    }
  }

  memoryUsageStats = stats;
  return stats;
}

/**
 * Records an AI request attempt (success or failure) and persists to Amplenote setting.
 * 
 * @param {object} app
 * @param {string} providerName
 * @param {boolean} isSuccess
 * @returns {Promise<object>} Updated stats
 */
export async function recordUsage(app, providerName, isSuccess) {
  const stats = getUsageStats(app);
  const targetProvider = providerName || PROVIDERS.OPENROUTER;

  if (!stats.providers[targetProvider]) {
    stats.providers[targetProvider] = createProviderBucket();
  }

  const resultKey = isSuccess ? "success" : "failed";

  // Increment global counters
  stats.today[resultKey] = (stats.today[resultKey] || 0) + 1;
  stats.lifetime[resultKey] = (stats.lifetime[resultKey] || 0) + 1;

  // Increment provider-specific counters
  stats.providers[targetProvider].today[resultKey] = (stats.providers[targetProvider].today[resultKey] || 0) + 1;
  stats.providers[targetProvider].lifetime[resultKey] = (stats.providers[targetProvider].lifetime[resultKey] || 0) + 1;

  memoryUsageStats = stats;
  const serialized = JSON.stringify(stats);

  if (app?.settings) {
    app.settings[USAGE_SETTING_KEY] = serialized;
  }

  // Persist to Amplenote settings
  if (typeof app?.setSetting === "function") {
    try {
      await app.setSetting(USAGE_SETTING_KEY, serialized);
    } catch (err) {
      console.warn("[GrammarReviewer] Failed to persist AI usage stats:", err);
    }
  }

  return stats;
}

/**
 * Resets usage statistics (either today only, or all statistics) and persists to Amplenote setting.
 * 
 * @param {object} app
 * @param {"today"|"all"} [mode="today"]
 * @returns {Promise<object>} Reset stats
 */
export async function resetUsage(app, mode = "today") {
  const stats = getUsageStats(app);

  if (mode === "today") {
    stats.today = { success: 0, failed: 0 };
    for (const key of Object.keys(stats.providers)) {
      stats.providers[key].today = { success: 0, failed: 0 };
    }
  } else if (mode === "all") {
    stats.today = { success: 0, failed: 0 };
    stats.lifetime = { success: 0, failed: 0 };
    for (const key of Object.keys(stats.providers)) {
      stats.providers[key].today = { success: 0, failed: 0 };
      stats.providers[key].lifetime = { success: 0, failed: 0 };
    }
  }

  memoryUsageStats = stats;
  const serialized = JSON.stringify(stats);

  if (app?.settings) {
    app.settings[USAGE_SETTING_KEY] = serialized;
  }

  if (typeof app?.setSetting === "function") {
    try {
      await app.setSetting(USAGE_SETTING_KEY, serialized);
    } catch (err) {
      console.warn("[GrammarReviewer] Failed to persist reset AI usage stats:", err);
    }
  }

  return stats;
}
