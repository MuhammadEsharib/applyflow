export type StorageKey = 'jobs' | 'notifications' | 'ui' | 'auth' | 'activity' | 'guest' | 'companies' | 'theme' | 'userSettings' | 'guestAccounts';

class Storage {
  private prefix = 'applyflow_';

  get<T>(key: StorageKey, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return defaultValue;
    }
  }

  set<T>(key: StorageKey, value: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to storage:`, error);
    }
  }

  remove(key: StorageKey): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  }

  clear(): void {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export const storage = new Storage();
