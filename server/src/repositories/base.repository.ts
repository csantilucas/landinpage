import { prisma } from '../config/prisma.js';
import { OperationalBaseItem } from '../models/base.model.js';

function safeParseJSON<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapFromPrisma(record: any): OperationalBaseItem {
  return {
    ...record,
    _id: record.id,
    id: record.id,
    phones: Array.isArray(record.phones) ? record.phones : safeParseJSON(record.phones, []),
    highlights: Array.isArray(record.highlights) ? record.highlights : safeParseJSON(record.highlights, []),
    coordinates:
      typeof record.coordinates === 'object' && record.coordinates !== null
        ? record.coordinates
        : safeParseJSON(record.coordinates, undefined),
  };
}

function mapToPrisma(data: any) {
  const { _id, id, createdAt, updatedAt, ...rest } = data;
  const result: any = { ...rest };

  if (id !== undefined) result.id = id;
  if (rest.phones !== undefined) {
    result.phones = typeof rest.phones === 'string' ? rest.phones : JSON.stringify(rest.phones || []);
  }
  if (rest.highlights !== undefined) {
    result.highlights =
      typeof rest.highlights === 'string'
        ? rest.highlights
        : rest.highlights
        ? JSON.stringify(rest.highlights)
        : null;
  }
  if (rest.coordinates !== undefined) {
    result.coordinates =
      typeof rest.coordinates === 'string'
        ? rest.coordinates
        : rest.coordinates
        ? JSON.stringify(rest.coordinates)
        : null;
  }

  return result;
}

export class BaseRepository {
  async findAll(): Promise<OperationalBaseItem[]> {
    let items = await prisma.operationalBase.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    });

    // Se a tabela estiver vazia, verifica se há dados antigos em site_contents
    if (items.length === 0) {
      const legacyBasesDoc = await prisma.siteContent.findUnique({
        where: { key: 'company_bases' },
      });

      if (legacyBasesDoc?.data) {
        const parsedData = safeParseJSON<any[]>(legacyBasesDoc.data, []);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          for (let idx = 0; idx < parsedData.length; idx++) {
            const b = parsedData[idx];
            const baseId = b.id || `base-${idx + 1}`;
            await prisma.operationalBase.upsert({
              where: { id: baseId },
              create: {
                id: baseId,
                name: b.name || '',
                city: b.city || '',
                state: b.state || '',
                type: b.type || '',
                address: b.address || '',
                phones: JSON.stringify(b.phones || []),
                whatsappNumber: b.whatsappNumber || '',
                whatsappDisplay: b.whatsappDisplay || '',
                coverage: b.coverage || null,
                highlights: b.highlights ? JSON.stringify(b.highlights) : null,
                coordinates: b.coordinates ? JSON.stringify(b.coordinates) : null,
                googleMapsUrl: b.googleMapsUrl || '',
                embedUrl: b.embedUrl || '',
                wazeUrl: b.wazeUrl || null,
                order: idx + 1,
                active: true,
              },
              update: {},
            });
          }
          items = await prisma.operationalBase.findMany({
            orderBy: [{ order: 'asc' }, { id: 'asc' }],
          });
        }
      }
    }

    return items.map(mapFromPrisma);
  }

  async findActive(): Promise<OperationalBaseItem[]> {
    const all = await this.findAll();
    return all.filter((b) => b.active !== false);
  }

  async findByIdOrSlug(idOrSlug: string): Promise<OperationalBaseItem | null> {
    try {
      const item = await prisma.operationalBase.findUnique({
        where: { id: idOrSlug },
      });
      return item ? mapFromPrisma(item) : null;
    } catch {
      return null;
    }
  }

  async create(data: Omit<OperationalBaseItem, '_id' | 'createdAt' | 'updatedAt'>): Promise<OperationalBaseItem> {
    const baseId = data.id || `base-${Date.now()}`;
    const prismaData = mapToPrisma({
      ...data,
      id: baseId,
      active: data.active ?? true,
      order: data.order ?? 0,
    });

    const item = await prisma.operationalBase.create({
      data: prismaData,
    });
    return mapFromPrisma(item);
  }

  async update(idOrSlug: string, data: Partial<OperationalBaseItem>): Promise<OperationalBaseItem | null> {
    try {
      const prismaData = mapToPrisma(data);
      const item = await prisma.operationalBase.update({
        where: { id: idOrSlug },
        data: prismaData,
      });
      return mapFromPrisma(item);
    } catch {
      return null;
    }
  }

  async delete(idOrSlug: string): Promise<boolean> {
    try {
      await prisma.operationalBase.delete({
        where: { id: idOrSlug },
      });
      return true;
    } catch {
      return false;
    }
  }
}
