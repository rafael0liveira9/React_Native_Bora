import AsyncStorage from '@react-native-async-storage/async-storage';

export class CacheManager {
  private static readonly CACHE_PREFIX = '@EaiBora:cache:';
  private static readonly EXPIRY_SUFFIX = ':expiry';

  /**
   * Salva dados no cache com tempo de expiração
   */
  static async set(key: string, value: any, ttlMinutes: number = 30): Promise<void> {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${key}`;
      const expiryKey = `${cacheKey}${this.EXPIRY_SUFFIX}`;
      const expiryTime = Date.now() + (ttlMinutes * 60 * 1000);

      await AsyncStorage.multiSet([
        [cacheKey, JSON.stringify(value)],
        [expiryKey, expiryTime.toString()]
      ]);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Recupera dados do cache (retorna null se expirado)
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${key}`;
      const expiryKey = `${cacheKey}${this.EXPIRY_SUFFIX}`;

      const [[, value], [, expiry]] = await AsyncStorage.multiGet([cacheKey, expiryKey]);

      if (!value || !expiry) return null;

      const expiryTime = parseInt(expiry, 10);
      if (Date.now() > expiryTime) {
        // Cache expirado, remover
        await this.remove(key);
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Remove item do cache
   */
  static async remove(key: string): Promise<void> {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${key}`;
      const expiryKey = `${cacheKey}${this.EXPIRY_SUFFIX}`;
      await AsyncStorage.multiRemove([cacheKey, expiryKey]);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  /**
   * Limpa todo o cache
   */
  static async clearAll(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Verifica se existe cache válido
   */
  static async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }
}
