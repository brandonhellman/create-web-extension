interface Entries {
  [key: string]: any;
}

interface Plugins {
  [key: string]: any;
}

export async function getWebExtension() {
  const entries: Entries = {};
  const plugins: Plugins[] = [];

  return {
    entries,
    plugins,
  };
}
