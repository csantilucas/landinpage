import { API_BASE_URL } from './auth-client';

export interface Notice {
  _id: string;
  title: string;
  description?: string;
  message?: string;
  active: boolean;
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  type?: string;
  priority?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FleetItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  active: boolean;
  category?: 'carrossel' | 'hero' | 'sobre' | string;
  createdAt: string;
  updatedAt: string;
}

export interface BannerItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  active: boolean;
  linkUrl?: string;
  linkText?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SiteImage = FleetItem;

export interface SectionOrderItem {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  order: number;
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
  _id?: string;
  order?: number;
  active?: boolean;
}

/**
 * Converte links compartilhados do Google Drive em links diretos de imagem
 */
export function formatImageUrl(url?: string, fallback: string = ''): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1600`;
  }
  return trimmed;
}

// -------------------------------------------------------------
// Funções Públicas (Landing Page)
// -------------------------------------------------------------

export async function fetchActiveNotices(): Promise<Notice[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/notices/active`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Erro ao buscar avisos ativos:', error);
    return [];
  }
}

export async function fetchActiveFleet(): Promise<FleetItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fleet`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Erro ao buscar frota ativa:', error);
    return [];
  }
}

export async function fetchActiveBanners(): Promise<BannerItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/banners`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Erro ao buscar banners ativos:', error);
    return [];
  }
}

export async function fetchActiveBases(): Promise<OperationalBase[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bases`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Erro ao buscar bases ativas:', error);
    return [];
  }
}

export async function fetchSiteContent(key?: string): Promise<any> {
  try {
    const url = key ? `${API_BASE_URL}/api/content/${key}` : `${API_BASE_URL}/api/content`;
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return key ? null : {};
    const data = await res.json();
    return data.success ? data.data : (key ? null : {});
  } catch (error) {
    console.error('Erro ao buscar conteúdos:', error);
    return key ? null : {};
  }
}

export interface CommodityItem {
  id: string;
  name: string;
  symbol: string;
  category: 'fuel' | 'oil' | 'agro';
  unitOriginal: string;
  unitBrl: string;
  priceUsd: number;
  priceBrl: number;
  change: string;
  isPositive: boolean;
  history: number[];
}

export interface CommoditiesData {
  items: CommodityItem[];
  usdToBrl: number;
  updatedAt: string;
  nextUpdateAt: string;
  source: 'commodities-api' | 'cache' | 'fallback';
  isStale?: boolean;
  isAvailable?: boolean;
  message?: string;
}

export async function fetchCommodities(): Promise<CommoditiesData | null> {
  // 1. Tenta a Route Handler interna do Next.js (/api/market-prices) com cache automático na Vercel
  try {
    const isBrowser = typeof window !== 'undefined';
    const baseUrl = isBrowser ? '' : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    const localRes = await fetch(`${baseUrl}/api/market-prices`, {
      next: { revalidate: 60 },
    });
    if (localRes.ok) {
      const json = await localRes.json();
      if (json.success && json.data) return json.data;
    }
  } catch {
    // Fallback silencioso para o backend Express
  }

  // 2. Fallback para o backend Express (/api/commodities)
  try {
    const res = await fetch(`${API_BASE_URL}/api/commodities`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Erro ao buscar cotações de commodities:', error);
    return null;
  }
}

export async function refreshCommodities(): Promise<CommoditiesData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/commodities/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Erro ao atualizar commodities no backend:', error);
    return null;
  }
}

// -------------------------------------------------------------
// Funções Administrativas (Painel Admin - com credenciais de sessão)
// -------------------------------------------------------------

async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Erro na requisição administrativa');
  }
  return json;
}

export const adminApi = {
  // Avisos
  getNotices: () => adminFetch('/api/admin/notices'),
  createNotice: (data: Partial<Notice>) =>
    adminFetch('/api/admin/notices', { method: 'POST', body: JSON.stringify(data) }),
  updateNotice: (id: string, data: Partial<Notice>) =>
    adminFetch(`/api/admin/notices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNotice: (id: string) =>
    adminFetch(`/api/admin/notices/${id}`, { method: 'DELETE' }),
  toggleNotice: (id: string) =>
    adminFetch(`/api/admin/notices/${id}/toggle`, { method: 'PATCH' }),

  // Imagens do Site & Frota (Fotos/Links)
  getFleet: () => adminFetch('/api/admin/fleet'),
  createFleet: (data: Partial<FleetItem>) =>
    adminFetch('/api/admin/fleet', { method: 'POST', body: JSON.stringify(data) }),
  updateFleet: (id: string, data: Partial<FleetItem>) =>
    adminFetch(`/api/admin/fleet/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFleet: (id: string) =>
    adminFetch(`/api/admin/fleet/${id}`, { method: 'DELETE' }),

  getImages: () => adminFetch('/api/admin/fleet'),
  createImage: (data: Partial<FleetItem>) =>
    adminFetch('/api/admin/fleet', { method: 'POST', body: JSON.stringify(data) }),
  updateImage: (id: string, data: Partial<FleetItem>) =>
    adminFetch(`/api/admin/fleet/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteImage: (id: string) =>
    adminFetch(`/api/admin/fleet/${id}`, { method: 'DELETE' }),

  // Conteúdo do Site
  getContent: () => adminFetch('/api/admin/content'),
  updateContent: (key: string, data: Record<string, any>) =>
    adminFetch(`/api/admin/content/${key}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Banners do Topo (Carrossel)
  getBanners: () => adminFetch('/api/admin/banners'),
  createBanner: (data: Partial<BannerItem>) =>
    adminFetch('/api/admin/banners', { method: 'POST', body: JSON.stringify(data) }),
  updateBanner: (id: string, data: Partial<BannerItem>) =>
    adminFetch(`/api/admin/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBanner: (id: string) =>
    adminFetch(`/api/admin/banners/${id}`, { method: 'DELETE' }),

  // Bases Operacionais
  getBases: () => adminFetch('/api/admin/bases'),
  createBase: (data: Partial<OperationalBase>) =>
    adminFetch('/api/admin/bases', { method: 'POST', body: JSON.stringify(data) }),
  updateBase: (id: string, data: Partial<OperationalBase>) =>
    adminFetch(`/api/admin/bases/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBase: (id: string) =>
    adminFetch(`/api/admin/bases/${id}`, { method: 'DELETE' }),
};
