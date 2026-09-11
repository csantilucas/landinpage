import { ObjectId } from 'mongodb';

export interface FleetItem {
  _id?: ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  active: boolean;
  category?: 'carrossel' | 'hero' | 'sobre' | string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateFleetItemDTO = Omit<FleetItem, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateFleetItemDTO = Partial<CreateFleetItemDTO>;
