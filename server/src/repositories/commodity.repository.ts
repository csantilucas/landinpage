import { Collection } from 'mongodb';
import { getDB } from '../config/db.js';
import { CommoditiesCacheDocument } from '../models/commodity.model.js';

export class CommodityRepository {
  private get collection(): Collection<CommoditiesCacheDocument> {
    return getDB().collection<CommoditiesCacheDocument>('commodities_cache');
  }

  async getLatest(): Promise<CommoditiesCacheDocument | null> {
    return this.collection.findOne({ key: 'latest_market_rates' });
  }

  async saveLatest(data: Omit<CommoditiesCacheDocument, 'key'>): Promise<void> {
    await this.collection.updateOne(
      { key: 'latest_market_rates' },
      { $set: { ...data, key: 'latest_market_rates' } },
      { upsert: true }
    );
  }
}
