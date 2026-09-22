import { prisma } from '../config/prisma.js';
import { BannerItem } from '../models/banner.model.js';

function mapToBannerItem(item: any): BannerItem {
  return {
    ...item,
    id: item.id,
    _id: item.id,
  };
}

export class BannerRepository {
  async findAll(): Promise<BannerItem[]> {
    const items = await prisma.banner.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return items.map(mapToBannerItem);
  }

  async findActive(): Promise<BannerItem[]> {
    const items = await prisma.banner.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return items.map(mapToBannerItem);
  }

  async findById(id: string): Promise<BannerItem | null> {
    try {
      const item = await prisma.banner.findUnique({
        where: { id },
      });
      return item ? mapToBannerItem(item) : null;
    } catch {
      return null;
    }
  }

  async create(data: Omit<BannerItem, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<BannerItem> {
    const { id: _, _id: __, ...rest } = data as any;
    const item = await prisma.banner.create({
      data: {
        title: rest.title,
        description: rest.description,
        imageUrl: rest.imageUrl,
        order: rest.order ?? 0,
        active: rest.active ?? true,
        linkUrl: rest.linkUrl ?? null,
        linkText: rest.linkText ?? null,
      },
    });
    return mapToBannerItem(item);
  }

  async update(id: string, data: Partial<BannerItem>): Promise<BannerItem | null> {
    try {
      const { id: _, _id: __, createdAt: ___, updatedAt: ____, ...cleanData } = data;
      const item = await prisma.banner.update({
        where: { id },
        data: cleanData as any,
      });
      return mapToBannerItem(item);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.banner.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
