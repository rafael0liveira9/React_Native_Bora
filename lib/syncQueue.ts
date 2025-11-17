import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QueueItem {
  id: string;
  type: 'exercise_complete' | 'serie_update' | 'training_complete' | 'post_create' | 'generic';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  headers?: Record<string, string>;
  timestamp: number;
  retries: number;
}

export class SyncQueue {
  private static readonly QUEUE_KEY = '@EaiBora:syncQueue';
  private static readonly MAX_RETRIES = 3;
  private static isProcessing = false;

  /**
   * Adiciona item na fila de sincronização
   */
  static async add(item: Omit<QueueItem, 'id' | 'timestamp' | 'retries'>): Promise<string> {
    try {
      const queue = await this.getQueue();
      const id = `${item.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const queueItem: QueueItem = {
        ...item,
        id,
        timestamp: Date.now(),
        retries: 0
      };

      queue.push(queueItem);
      await this.saveQueue(queue);

      // Tentar processar imediatamente
      this.processQueue().catch((err) => {
        // Silently handle background processing errors
      });

      return id;
    } catch (error) {
      console.error('Erro ao adicionar na fila:', error);
      throw error;
    }
  }

  /**
   * Recupera a fila de sincronização
   */
  private static async getQueue(): Promise<QueueItem[]> {
    try {
      const queueJson = await AsyncStorage.getItem(this.QUEUE_KEY);
      return queueJson ? JSON.parse(queueJson) : [];
    } catch (error) {
      console.error('Erro ao recuperar fila:', error);
      return [];
    }
  }

  /**
   * Salva a fila de sincronização
   */
  private static async saveQueue(queue: QueueItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Erro ao salvar fila:', error);
    }
  }

  /**
   * Processa a fila de sincronização
   */
  static async processQueue(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      const queue = await this.getQueue();
      if (queue.length === 0) {
        this.isProcessing = false;
        return;
      }

      const item = queue[0];

      try {
        // Importar dinamicamente o axios
        const axios = (await import('axios')).default;

        await axios({
          method: item.method,
          url: item.endpoint,
          data: item.data,
          headers: item.headers
        });

        // Sucesso - remover da fila
        queue.shift();
        await this.saveQueue(queue);
      } catch (error: any) {
        // Incrementar retries
        item.retries += 1;

        if (item.retries >= this.MAX_RETRIES) {
          // Máximo de tentativas atingido - remover da fila
          queue.shift();
        } else {
          // Mover para o final da fila
          queue.shift();
          queue.push(item);
        }

        await this.saveQueue(queue);
      }

      this.isProcessing = false;

      // Processar próximo item
      if (queue.length > 0) {
        setTimeout(() => this.processQueue(), 1000);
      }
    } catch (error) {
      console.error('Erro no processamento da fila:', error);
      this.isProcessing = false;
    }
  }

  /**
   * Retorna o tamanho da fila
   */
  static async getQueueSize(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  }

  /**
   * Limpa toda a fila
   */
  static async clearQueue(): Promise<void> {
    await AsyncStorage.removeItem(this.QUEUE_KEY);
  }

  /**
   * Remove item específico da fila
   */
  static async removeItem(id: string): Promise<void> {
    const queue = await this.getQueue();
    const filteredQueue = queue.filter(item => item.id !== id);
    await this.saveQueue(filteredQueue);
  }
}
