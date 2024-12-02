async function get<T>(key: string): Promise<T | undefined> {
  const result = await chrome.storage.local.get(key);
  return result[key];
}

async function set<T>(key: string, value: T) {
  await chrome.storage.local.set({ [key]: value });
}

async function remove(key: string) {
  await chrome.storage.local.remove(key);
}

export const storage = {
  get,
  set,
  remove,
};
