import { ObjectId } from 'mongodb';

export type NoticeType = 'info' | 'warning' | 'alert' | 'success';

export interface Notice {
  _id?: ObjectId;
  title: string;
  message: string;
  type: NoticeType;
  active: boolean;
  priority: number;
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateNoticeDTO = Omit<Notice, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateNoticeDTO = Partial<CreateNoticeDTO>;
