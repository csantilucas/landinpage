import { Collection, ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { OperationalBaseItem } from '../models/base.model.js';

export class BaseRepository {
  private get collection(): Collection<OperationalBaseItem> {
    return getDB().collection<OperationalBaseItem>('operational_bases');
  }

  async findAll(): Promise<OperationalBaseItem[]> {
    let items = await this.collection.find({}).sort({ order: 1, _id: 1 }).toArray();
    
    // Se a coleção estiver vazia, verifica se há dados antigos em site_contents
    if (items.length === 0) {
      const siteContents = getDB().collection('site_contents');
      const legacyBasesDoc = await siteContents.findOne({ key: 'company_bases' });
      if (legacyBasesDoc && Array.isArray(legacyBasesDoc.data) && legacyBasesDoc.data.length > 0) {
        const seedItems: OperationalBaseItem[] = legacyBasesDoc.data.map((b: any, idx: number) => ({
          ...b,
          order: idx + 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        await this.collection.insertMany(seedItems as any);
        items = await this.collection.find({}).sort({ order: 1, _id: 1 }).toArray();
      }
    }

    return items;
  }

  async findActive(): Promise<OperationalBaseItem[]> {
    const all = await this.findAll();
    return all.filter((b) => b.active !== false);
  }

  async findByIdOrSlug(idOrSlug: string): Promise<OperationalBaseItem | null> {
    if (ObjectId.isValid(idOrSlug)) {
      const byObjId = await this.collection.findOne({ _id: new ObjectId(idOrSlug) });
      if (byObjId) return byObjId;
    }
    return this.collection.findOne({ id: idOrSlug });
  }

  async create(data: Omit<OperationalBaseItem, '_id' | 'createdAt' | 'updatedAt'>): Promise<OperationalBaseItem> {
    const now = new Date();
    const doc: OperationalBaseItem = {
      ...data,
      active: data.active ?? true,
      order: data.order ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    const result = await this.collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
  }

  async update(idOrSlug: string, data: Partial<OperationalBaseItem>): Promise<OperationalBaseItem | null> {
    const { _id, ...cleanData } = data;
    const filter = ObjectId.isValid(idOrSlug)
      ? { $or: [{ _id: new ObjectId(idOrSlug) }, { id: idOrSlug }] }
      : { id: idOrSlug };

    const result = await this.collection.findOneAndUpdate(
      filter,
      {
        $set: {
          ...cleanData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );
    return result as OperationalBaseItem | null;
  }

  async delete(idOrSlug: string): Promise<boolean> {
    const filter = ObjectId.isValid(idOrSlug)
      ? { $or: [{ _id: new ObjectId(idOrSlug) }, { id: idOrSlug }] }
      : { id: idOrSlug };

    const result = await this.collection.deleteOne(filter);
    return result.deletedCount > 0;
  }
}
