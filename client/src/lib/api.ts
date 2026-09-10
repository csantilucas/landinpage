import { API_BASE_URL } from './auth-client';

export interface Notice {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  active: boolean;
  priority: number;
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
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
  category?: 'carrossel' | 'hero' | 'sobre' | 'servicos' | 'geral' | string;
  createdAt: string;
  updatedAt: string;
}

export type SiteImage = FleetItem;

export interface SectionOrderItem {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  order: number;
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
};
