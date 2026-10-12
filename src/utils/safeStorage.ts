/**
 * Safe Storage Wrapper with Automatic In-Memory Fallback
 * Prevents SecurityError, QuotaExceededError, or sandbox access denial in iframes.
 */

class MemoryStorage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    try {
      this.store.set(key, String(value));
    } catch {
      // Ignore memory allocation issues
    }
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

class SafeStorageWrapper {
  private memFallback = new MemoryStorage();
  private hasNativeStorage = false;

  constructor() {
    this.hasNativeStorage = this.testStorageAvailability();
  }

  private testStorageAvailability(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__mt_storage_probe__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem(key: string): string | null {
    if (this.hasNativeStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        // Fallback to memory
        return this.memFallback.getItem(key);
      }
    }
    return this.memFallback.getItem(key);
  }

  setItem(key: string, value: string): void {
    if (this.hasNativeStorage) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch {
        // QuotaExceededError or SecurityError -> save to memory
        this.memFallback.setItem(key, value);
        return;
      }
    }
    this.memFallback.setItem(key, value);
  }

  removeItem(key: string): void {
    if (this.hasNativeStorage) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore
      }
    }
    this.memFallback.removeItem(key);
  }

  clear(): void {
    if (this.hasNativeStorage) {
      try {
        window.localStorage.clear();
      } catch {
        // Ignore
      }
    }
    this.memFallback.clear();
  }
}

export const safeStorage = new SafeStorageWrapper();
