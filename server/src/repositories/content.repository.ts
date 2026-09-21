import { prisma } from '../config/prisma.js';
import { SiteContent } from '../models/content.model.js';

function safeParseJSON<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapToSiteContent(record: any): SiteContent {
  return {
    id: record.id,
    _id: record.id,
    key: record.key,
    data: typeof record.data === 'string' ? safeParseJSON(record.data, {}) : record.data,
    updatedAt: record.updatedAt,
  };
}

export class ContentRepository {
  async findAll(): Promise<SiteContent[]> {
    const records = await prisma.siteContent.findMany();
    return records.map(mapToSiteContent);
  }

  async findByKey(key: string): Promise<SiteContent | null> {
    try {
      const record = await prisma.siteContent.findUnique({
        where: { key },
      });
      return record ? mapToSiteContent(record) : null;
    } catch {
      return null;
    }
  }

  async upsert(key: string, data: Record<string, any>): Promise<SiteContent> {
    const serialized = typeof data === 'string' ? data : JSON.stringify(data);
    const record = await prisma.siteContent.upsert({
      where: { key },
      update: {
        data: serialized,
        updatedAt: new Date(),
      },
      create: {
        key,
        data: serialized,
      },
    });

    return mapToSiteContent(record);
  }
}
