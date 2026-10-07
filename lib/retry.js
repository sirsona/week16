// Retry a transient failure with exponential backoff.
// Permanent failures (HTTP 4xx) are thrown immediately -- see the Week 16
// Day 4 "Common Mistakes": do not retry a 400, it will fail again.
export async function withRetry(fn, { attempts = 3, baseDelayMs = 500 } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;

      const status = err?.response?.status;
      if (status >= 400 && status < 500) throw err;

      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseDelayMs * Math.pow(2, i)));
      }
    }
  }
  throw lastErr;
}
