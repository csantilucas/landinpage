import { prisma } from '../config/prisma.js';
import { CommoditiesCacheDocument } from '../models/commodity.model.js';

function safeParseJSON<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapToCommoditiesCache(record: any): CommoditiesCacheDocument {
  return {
    id: record.id,
    _id: record.id,
    key: record.key,
    items: typeof record.items === 'string' ? safeParseJSON(record.items, []) : record.items,
    usdToBrl: record.usdToBrl,
    updatedAt: record.updatedAt,
    nextUpdateAt: record.nextUpdateAt,
    source: record.source as any,
    rawRates: typeof record.rawRates === 'string' ? safeParseJSON(record.rawRates, undefined) : record.rawRates,
  };
}

export class CommodityRepository {
  async getLatest(): Promise<CommoditiesCacheDocument | null> {
    try {
      const record = await prisma.commoditiesCache.findUnique({
        where: { key: 'latest_market_rates' },
      });
      return record ? mapToCommoditiesCache(record) : null;
    } catch {
      return null;
    }
  }

  async saveLatest(data: Omit<CommoditiesCacheDocument, 'key'>): Promise<void> {
    const itemsSerialized = typeof data.items === 'string' ? data.items : JSON.stringify(data.items || []);
    const rawRatesSerialized = data.rawRates
      ? typeof data.rawRates === 'string'
        ? data.rawRates
        : JSON.stringify(data.rawRates)
      : null;

    await prisma.commoditiesCache.upsert({
      where: { key: 'latest_market_rates' },
      update: {
        items: itemsSerialized,
        usdToBrl: data.usdToBrl,
        updatedAt: data.updatedAt || new Date(),
        nextUpdateAt: data.nextUpdateAt,
        source: data.source,
        rawRates: rawRatesSerialized,
      },
      create: {
        key: 'latest_market_rates',
        items: itemsSerialized,
        usdToBrl: data.usdToBrl,
        updatedAt: data.updatedAt || new Date(),
        nextUpdateAt: data.nextUpdateAt,
        source: data.source,
        rawRates: rawRatesSerialized,
      },
    });
  }
}
