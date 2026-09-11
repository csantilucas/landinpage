import { Collection, ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { BannerItem } from '../models/banner.model.js';

export class BannerRepository {
  private get collection(): Collection<BannerItem> {
    return getDB().collection<BannerItem>('banners');
  }

  async findAll(): Promise<BannerItem[]> {
    return this.collection.find({}).sort({ order: 1, createdAt: -1 }).toArray();
  }

  async findActive(): Promise<BannerItem[]> {
    return this.collection.find({ active: true }).sort({ order: 1, createdAt: -1 }).toArray();
  }

  async findById(id: string): Promise<BannerItem | null> {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(data: Omit<BannerItem, '_id' | 'createdAt' | 'updatedAt'>): Promise<BannerItem> {
    const now = new Date();
    const doc: BannerItem = {
      ...data,
      active: data.active ?? true,
      order: data.order ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    const result = await this.collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
  }

  async update(id: string, data: Partial<BannerItem>): Promise<BannerItem | null> {
    const { _id, ...cleanData } = data;
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...cleanData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );
    return result as BannerItem | null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}
