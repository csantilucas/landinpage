import { ObjectId } from 'mongodb';

export interface BannerItem {
  _id?: ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  active: boolean;
  linkUrl?: string;
  linkText?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
