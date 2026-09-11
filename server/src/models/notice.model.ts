import { ObjectId } from 'mongodb';

export interface Notice {
  _id?: ObjectId;
  title: string;
  description: string;
  message?: string; // Mantido para compatibilidade
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  active: boolean;
  type?: string;
  priority?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateNoticeDTO = {
  title: string;
  description?: string;
  message?: string;
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  active?: boolean;
  type?: string;
  priority?: number;
};

export type UpdateNoticeDTO = Partial<CreateNoticeDTO>;

