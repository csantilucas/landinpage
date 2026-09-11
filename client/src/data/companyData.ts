/**
 * Tipos e Interfaces Institucionais
 * Obs: Os dados e textos do site agora são 100% carregados dinamicamente da API e do MongoDB.
 */

export interface OperationalBase {
  id: string;
  name: string;
  city: string;
  state: 'RO' | 'MT' | string;
  type: string;
  address: string;
  phones: string[];
  whatsappNumber: string;
  whatsappDisplay: string;
  coverage: string;
  highlights: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  googleMapsUrl: string;
  embedUrl: string;
  wazeUrl?: string;
}

export interface ProductService {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  features?: string[];
  details?: string[];
  idealFor?: string;
  badge?: string;
  iconName?: string;
}

export interface CompanyInfo {
  name: string;
  fullName: string;
  foundedYear: number;
  yearsOfExperience?: number;
  anttRegister: string;
  anpCompliant: boolean;
  matrizAddress: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  googleMapsUrl: string;
  googleMapsRouteUrl?: string;
  wazeUrl?: string;
  googleMapsEmbed?: string;
  mainPhone: string;
  mainEmergencyPhone?: string;
  mainWhatsApp: string;
  email: string;
  hours?: string;
}
