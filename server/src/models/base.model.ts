import { ObjectId } from 'mongodb';

export interface OperationalBaseItem {
  _id?: ObjectId;
  id: string;
  name: string;
  city: string;
  state: string;
  type: string;
  address: string;
  phones: string[];
  whatsappNumber: string;
  whatsappDisplay: string;
  coverage?: string;
  highlights?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  googleMapsUrl: string;
  embedUrl: string;
  wazeUrl?: string;
  order?: number;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
