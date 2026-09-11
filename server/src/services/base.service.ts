import { BaseRepository } from '../repositories/base.repository.js';
import { OperationalBaseItem } from '../models/base.model.js';
import { ContentRepository } from '../repositories/content.repository.js';

export class BaseService {
  constructor(
    private baseRepo = new BaseRepository(),
    private contentRepo = new ContentRepository()
  ) {}

  private async syncToSiteContent(): Promise<void> {
    try {
      const allActive = await this.baseRepo.findActive();
      await this.contentRepo.upsert('company_bases', allActive);
    } catch (e) {
      console.error('[BaseService] Falha ao sincronizar com site_contents:', e);
    }
  }

  async getAllBases(): Promise<OperationalBaseItem[]> {
    return this.baseRepo.findAll();
  }

  async getActiveBases(): Promise<OperationalBaseItem[]> {
    return this.baseRepo.findActive();
  }

  async getBaseById(id: string): Promise<OperationalBaseItem | null> {
    return this.baseRepo.findByIdOrSlug(id);
  }

  async createBase(data: Partial<OperationalBaseItem>): Promise<OperationalBaseItem> {
    if (!data.name?.trim()) {
      throw new Error('O nome da base operacional é obrigatório');
    }
    if (!data.city?.trim()) {
      throw new Error('A cidade da base é obrigatória');
    }
    if (!data.state?.trim()) {
      throw new Error('O estado da base é obrigatório');
    }

    const slug = (data.id || data.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')).trim();

    const created = await this.baseRepo.create({
      id: slug,
      name: data.name.trim(),
      city: data.city.trim(),
      state: data.state.trim().toUpperCase(),
      type: data.type?.trim() || 'Base Operacional',
      address: data.address?.trim() || '',
      phones: Array.isArray(data.phones) ? data.phones : (data.phones ? [String(data.phones)] : []),
      whatsappNumber: data.whatsappNumber?.trim() || '',
      whatsappDisplay: data.whatsappDisplay?.trim() || data.whatsappNumber?.trim() || '',
      coverage: data.coverage?.trim() || '',
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      googleMapsUrl: data.googleMapsUrl?.trim() || '',
      embedUrl: data.embedUrl?.trim() || '',
      wazeUrl: data.wazeUrl?.trim() || undefined,
      order: Number(data.order) || 0,
      active: data.active ?? true,
      coordinates: data.coordinates,
    });

    await this.syncToSiteContent();
    return created;
  }

  async updateBase(id: string, data: Partial<OperationalBaseItem>): Promise<OperationalBaseItem> {
    const existing = await this.baseRepo.findByIdOrSlug(id);
    if (!existing) {
      throw new Error('Base operacional não encontrada');
    }

    const updated = await this.baseRepo.update(id, data);
    if (!updated) {
      throw new Error('Falha ao atualizar a base operacional');
    }

    await this.syncToSiteContent();
    return updated;
  }

  async deleteBase(id: string): Promise<boolean> {
    const existing = await this.baseRepo.findByIdOrSlug(id);
    if (!existing) {
      throw new Error('Base operacional não encontrada');
    }
    const deleted = await this.baseRepo.delete(id);
    await this.syncToSiteContent();
    return deleted;
  }
}
