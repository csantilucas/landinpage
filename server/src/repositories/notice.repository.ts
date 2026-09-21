import { prisma } from '../config/prisma.js';
import { Notice, CreateNoticeDTO, UpdateNoticeDTO } from '../models/notice.model.js';

function mapToNotice(item: any): Notice {
  return {
    ...item,
    id: item.id,
    _id: item.id,
    message: item.message || item.description,
  };
}

export class NoticeRepository {
  async findAll(): Promise<Notice[]> {
    const items = await prisma.notice.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return items.map(mapToNotice);
  }

  async findActive(): Promise<Notice[]> {
    const items = await prisma.notice.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
    return items.map(mapToNotice);
  }

  async findById(id: string): Promise<Notice | null> {
    try {
      const item = await prisma.notice.findUnique({
        where: { id },
      });
      return item ? mapToNotice(item) : null;
    } catch {
      return null;
    }
  }

  async create(data: CreateNoticeDTO): Promise<Notice> {
    const description = data.description || data.message || '';
    const item = await prisma.notice.create({
      data: {
        title: data.title,
        description,
        message: description,
        imageUrl: data.imageUrl ?? null,
        linkUrl: data.linkUrl ?? null,
        linkText: data.linkText ?? null,
        active: data.active ?? true,
        type: data.type ?? null,
        priority: data.priority ?? 0,
      },
    });
    return mapToNotice(item);
  }

  async update(id: string, data: UpdateNoticeDTO): Promise<Notice | null> {
    try {
      const { id: _, _id: __, createdAt: ___, updatedAt: ____, ...cleanData } = data as any;
      if (cleanData.description && !cleanData.message) {
        cleanData.message = cleanData.description;
      } else if (cleanData.message && !cleanData.description) {
        cleanData.description = cleanData.message;
      }
      const item = await prisma.notice.update({
        where: { id },
        data: cleanData,
      });
      return mapToNotice(item);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.notice.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async toggleActive(id: string): Promise<Notice | null> {
    const current = await this.findById(id);
    if (!current) return null;
    return this.update(id, { active: !current.active });
  }
}
