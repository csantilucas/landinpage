import { BannerRepository } from '../repositories/banner.repository.js';
import { BannerItem } from '../models/banner.model.js';

export class BannerService {
  constructor(private bannerRepo = new BannerRepository()) {}

  async getAllBanners(): Promise<BannerItem[]> {
    return this.bannerRepo.findAll();
  }

  async getActiveBanners(): Promise<BannerItem[]> {
    return this.bannerRepo.findActive();
  }

  async getBannerById(id: string): Promise<BannerItem | null> {
    return this.bannerRepo.findById(id);
  }

  async createBanner(data: {
    title: string;
    description: string;
    imageUrl: string;
    order?: number;
    active?: boolean;
    linkUrl?: string;
    linkText?: string;
  }): Promise<BannerItem> {
    if (!data.title?.trim()) {
      throw new Error('O título do banner é obrigatório');
    }
    if (!data.imageUrl?.trim()) {
      throw new Error('A imagem do banner é obrigatória');
    }

    return this.bannerRepo.create({
      title: data.title.trim(),
      description: data.description?.trim() || '',
      imageUrl: data.imageUrl.trim(),
      order: Number(data.order) || 0,
      active: data.active ?? true,
      linkUrl: data.linkUrl?.trim() || undefined,
      linkText: data.linkText?.trim() || undefined,
    });
  }

  async updateBanner(id: string, data: Partial<BannerItem>): Promise<BannerItem> {
    const existing = await this.bannerRepo.findById(id);
    if (!existing) {
      throw new Error('Banner não encontrado');
    }

    const updateData: Partial<BannerItem> = {};
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl.trim();
    if (data.order !== undefined) updateData.order = Number(data.order);
    if (data.active !== undefined) updateData.active = Boolean(data.active);
    if (data.linkUrl !== undefined) updateData.linkUrl = data.linkUrl.trim();
    if (data.linkText !== undefined) updateData.linkText = data.linkText.trim();

    const updated = await this.bannerRepo.update(id, updateData);
    if (!updated) {
      throw new Error('Falha ao atualizar o banner');
    }
    return updated;
  }

  async deleteBanner(id: string): Promise<boolean> {
    const existing = await this.bannerRepo.findById(id);
    if (!existing) {
      throw new Error('Banner não encontrado');
    }
    return this.bannerRepo.delete(id);
  }
}
