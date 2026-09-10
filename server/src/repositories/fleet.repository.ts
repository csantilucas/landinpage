import { Collection, ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { FleetItem, CreateFleetItemDTO, UpdateFleetItemDTO } from '../models/fleet.model.js';

export class FleetRepository {
  private get collection(): Collection<FleetItem> {
    return getDB().collection<FleetItem>('fleet_items');
  }

  async findAll(): Promise<FleetItem[]> {
    return this.collection
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();
  }

  async findActive(): Promise<FleetItem[]> {
    return this.collection
      .find({ active: true })
      .sort({ order: 1, createdAt: -1 })
      .toArray();
  }

  async findById(id: string): Promise<FleetItem | null> {
    if (!ObjectId.isValid(id)) return null;
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(data: CreateFleetItemDTO): Promise<FleetItem> {
    const doc: FleetItem = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await this.collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
  }

  async update(id: string, data: UpdateFleetItemDTO): Promise<FleetItem | null> {
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
}
