export interface Notice {
  id?: string;
  _id?: string;
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
