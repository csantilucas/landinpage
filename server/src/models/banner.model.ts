export interface BannerItem {
  id?: string;
  _id?: string;
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
