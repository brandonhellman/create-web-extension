/**
 * Sleep for a specified amount of time
 * @param minMs - Minimum milliseconds to sleep
 * @param maxMs - Optional maximum milliseconds to sleep. If provided, will sleep for a random duration between ms and maxMs
 */
export async function sleep(minMs: number, maxMs?: number) {
  const duration = maxMs ? Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs : minMs;
  return new Promise((resolve) => setTimeout(resolve, duration));
}
