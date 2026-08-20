import { jest } from "@jest/globals";
import { 
  getTodayDateString, 
  getDefaultUsageStats, 
  getUsageStats, 
  recordUsage, 
  resetUsage, 
  clearMemoryUsageStats,
  USAGE_SETTING_KEY 
} from "../lib/data/usageTracker.js";
import { PROVIDERS } from "../lib/constants.js";

describe("AI Usage Tracker — Happy Path & Edge Cases", () => {
  let mockApp;

  beforeEach(() => {
    clearMemoryUsageStats();
    mockApp = {
      settings: {},
      setSetting: jest.fn(async (key, val) => {
        mockApp.settings[key] = val;
      })
    };
  });

  test("getDefaultUsageStats initializes all providers with 0 counts", () => {
    const stats = getDefaultUsageStats();
    expect(stats.date).toBe(getTodayDateString());
    expect(stats.today).toEqual({ success: 0, failed: 0 });
    expect(stats.lifetime).toEqual({ success: 0, failed: 0 });
    expect(stats.providers[PROVIDERS.OPENROUTER]).toBeDefined();
    expect(stats.providers[PROVIDERS.GEMINI]).toBeDefined();
    expect(stats.providers[PROVIDERS.GROQ]).toBeDefined();
  });

  test("getUsageStats returns default stats when settings are empty", () => {
    const stats = getUsageStats(mockApp);
    expect(stats.today.success).toBe(0);
    expect(stats.lifetime.success).toBe(0);
    expect(stats.providers[PROVIDERS.OPENROUTER].today.success).toBe(0);
  });

  test("recordUsage increments today and lifetime counters and calls setSetting", async () => {
    // Record 1 success for OpenRouter
    await recordUsage(mockApp, PROVIDERS.OPENROUTER, true);
    
    let stats = getUsageStats(mockApp);
    expect(stats.today.success).toBe(1);
    expect(stats.today.failed).toBe(0);
    expect(stats.lifetime.success).toBe(1);
    expect(stats.providers[PROVIDERS.OPENROUTER].today.success).toBe(1);
    expect(stats.providers[PROVIDERS.OPENROUTER].lifetime.success).toBe(1);

    // Record 1 failure for OpenRouter
    await recordUsage(mockApp, PROVIDERS.OPENROUTER, false);
    stats = getUsageStats(mockApp);
    expect(stats.today.success).toBe(1);
    expect(stats.today.failed).toBe(1);
    expect(stats.lifetime.failed).toBe(1);
    expect(stats.providers[PROVIDERS.OPENROUTER].today.failed).toBe(1);

    // Record 1 success for Groq
    await recordUsage(mockApp, PROVIDERS.GROQ, true);
    stats = getUsageStats(mockApp);
    expect(stats.today.success).toBe(2);
    expect(stats.lifetime.success).toBe(2);
    expect(stats.providers[PROVIDERS.GROQ].today.success).toBe(1);
    expect(stats.providers[PROVIDERS.GROQ].lifetime.success).toBe(1);
    expect(stats.providers[PROVIDERS.OPENROUTER].today.success).toBe(1);

    expect(mockApp.setSetting).toHaveBeenCalledWith(USAGE_SETTING_KEY, expect.any(String));
  });

  test("getUsageStats automatically resets today counts when date changes (daily rollover)", () => {
    mockApp.settings[USAGE_SETTING_KEY] = JSON.stringify({
      version: 1,
      date: "2026-01-01", // Past date
      today: { success: 25, failed: 2 },
      lifetime: { success: 100, failed: 5 },
      providers: {
        [PROVIDERS.OPENROUTER]: {
          today: { success: 25, failed: 2 },
          lifetime: { success: 100, failed: 5 }
        }
      }
    });

    const stats = getUsageStats(mockApp);
    expect(stats.date).toBe(getTodayDateString());
    // today should be rolled over to 0
    expect(stats.today.success).toBe(0);
    expect(stats.today.failed).toBe(0);
    expect(stats.providers[PROVIDERS.OPENROUTER].today.success).toBe(0);
    // lifetime should remain intact
    expect(stats.lifetime.success).toBe(100);
    expect(stats.lifetime.failed).toBe(5);
    expect(stats.providers[PROVIDERS.OPENROUTER].lifetime.success).toBe(100);
  });

  test("resetUsage with mode='today' zeroes today counts but preserves lifetime", async () => {
    await recordUsage(mockApp, PROVIDERS.GEMINI, true);
    await recordUsage(mockApp, PROVIDERS.GEMINI, true);
    await recordUsage(mockApp, PROVIDERS.GEMINI, false);

    await resetUsage(mockApp, "today");
    const stats = getUsageStats(mockApp);

    expect(stats.today.success).toBe(0);
    expect(stats.today.failed).toBe(0);
    expect(stats.providers[PROVIDERS.GEMINI].today.success).toBe(0);
    expect(stats.providers[PROVIDERS.GEMINI].today.failed).toBe(0);

    expect(stats.lifetime.success).toBe(2);
    expect(stats.lifetime.failed).toBe(1);
    expect(stats.providers[PROVIDERS.GEMINI].lifetime.success).toBe(2);
    expect(stats.providers[PROVIDERS.GEMINI].lifetime.failed).toBe(1);
  });

  test("resetUsage with mode='all' zeroes both today and lifetime counts", async () => {
    await recordUsage(mockApp, PROVIDERS.OPENROUTER, true);
    await recordUsage(mockApp, PROVIDERS.MISTRAL, true);

    await resetUsage(mockApp, "all");
    const stats = getUsageStats(mockApp);

    expect(stats.today.success).toBe(0);
    expect(stats.lifetime.success).toBe(0);
    expect(stats.providers[PROVIDERS.OPENROUTER].lifetime.success).toBe(0);
    expect(stats.providers[PROVIDERS.MISTRAL].lifetime.success).toBe(0);
  });
});
