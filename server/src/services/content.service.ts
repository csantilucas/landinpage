import { ContentRepository } from '../repositories/content.repository.js';
import { SiteContent } from '../models/content.model.js';

export class ContentService {
  constructor(private contentRepo = new ContentRepository()) {}

  async getAllContents(): Promise<Record<string, any>> {
    const items = await this.contentRepo.findAll();
    const mapped: Record<string, any> = {};
    for (const item of items) {
      mapped[item.key] = item.data;
    }
    return mapped;
  }

  async getContentByKey(key: string): Promise<Record<string, any> | null> {
    const item = await this.contentRepo.findByKey(key);
    return item ? item.data : null;
  }

  async updateContent(key: string, data: Record<string, any>): Promise<SiteContent> {
    if (!key?.trim()) {
      throw new Error('A chave de conteúdo é obrigatória');
    }
    if (!data || typeof data !== 'object') {
      throw new Error('Os dados do conteúdo devem ser um objeto válido');
    }

    return this.contentRepo.upsert(key.trim(), data);
  }
}
