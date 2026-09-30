import type { Storage } from "redux-persist";

// redux-persist/lib/storage CommonJS hai, Vite 8 me uska default import toot jaata hai
// ("storage.getItem is not a function"). Isliye localStorage ka apna async wrapper.
// Private mode / blocked storage me localStorage throw kar sakta hai, tab app bina persist ke chalega.
const storage: Storage = {
  getItem: async (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  removeItem: async (key: string) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

export default storage;
