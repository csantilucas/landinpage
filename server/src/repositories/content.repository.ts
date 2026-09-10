import { Collection } from 'mongodb';
import { getDB } from '../config/db.js';
import { SiteContent } from '../models/content.model.js';

export class ContentRepository {
  private get collection(): Collection<SiteContent> {
    return getDB().collection<SiteContent>('site_contents');
  }

  async findAll(): Promise<SiteContent[]> {
    return this.collection.find({}).toArray();
  }

  async findByKey(key: string): Promise<SiteContent | null> {
    return this.collection.findOne({ key });
  }

  async upsert(key: string, data: Record<string, any>): Promise<SiteContent> {
    const result = await this.collection.findOneAndUpdate(
      { key },
      {
        $set: {
          key,
          data,
          updatedAt: new Date(),
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    return result as SiteContent;
  }
}
