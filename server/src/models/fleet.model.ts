export interface FleetItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  active: boolean;
  category?: 'carrossel' | 'hero' | 'sobre' | string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateFleetItemDTO = Omit<FleetItem, 'id' | '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateFleetItemDTO = Partial<CreateFleetItemDTO>;
