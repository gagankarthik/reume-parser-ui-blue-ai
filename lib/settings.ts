// Client-side settings persisted in localStorage: the target API base URL and
// the API key used for X-API-Key. Used by the API client to tell the server-side
// proxy where to forward requests.

export interface ApiSettings {
  baseUrl: string;
  apiKey: string;
}

const STORAGE_KEY = "rp-ui-settings";

// Default to the current production Function URL; editable on the Settings page.
export const DEFAULT_BASE_URL =
  "https://dqzxwwacosqcxipouyzxnrh7ky0sdnqw.lambda-url.us-east-2.on.aws/";

export function getSettings(): ApiSettings {
  if (typeof window === "undefined") {
    return { baseUrl: DEFAULT_BASE_URL, apiKey: "" };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ApiSettings>;
      return {
        baseUrl: parsed.baseUrl?.trim() || DEFAULT_BASE_URL,
        apiKey: parsed.apiKey ?? "",
      };
    }
  } catch {
    /* ignore malformed storage */
  }
  return { baseUrl: DEFAULT_BASE_URL, apiKey: "" };
}

export function saveSettings(settings: ApiSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  // Notify same-tab listeners (the storage event only fires cross-tab).
  window.dispatchEvent(new Event("rp-settings-changed"));
}
