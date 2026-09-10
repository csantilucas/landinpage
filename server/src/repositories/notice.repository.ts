import { Collection, ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { Notice, CreateNoticeDTO, UpdateNoticeDTO } from '../models/notice.model.js';

export class NoticeRepository {
  private get collection(): Collection<Notice> {
    return getDB().collection<Notice>('notices');
  }

  async findAll(): Promise<Notice[]> {
    return this.collection
      .find({})
      .sort({ priority: -1, createdAt: -1 })
      .toArray();
  }

  async findActive(): Promise<Notice[]> {
    return this.collection
      .find({ active: true })
      .sort({ priority: -1, createdAt: -1 })
      .toArray();
  }

  async findById(id: string): Promise<Notice | null> {
    if (!ObjectId.isValid(id)) return null;
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(data: CreateNoticeDTO): Promise<Notice> {
    const doc: Notice = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await this.collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
  }

  async update(id: string, data: UpdateNoticeDTO): Promise<Notice | null> {
    if (!ObjectId.isValid(id)) return null;

    const updateDoc = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    return result || null;
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async toggleActive(id: string): Promise<Notice | null> {
    if (!ObjectId.isValid(id)) return null;
    const current = await this.findById(id);
    if (!current) return null;

    return this.update(id, { active: !current.active });
  }
}
