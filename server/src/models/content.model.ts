import { ObjectId } from 'mongodb';

export interface SiteContent {
  _id?: ObjectId;
  key: string;
  data: Record<string, any>;
  updatedAt: Date;
}
