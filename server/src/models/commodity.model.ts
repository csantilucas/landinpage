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

export interface CommoditiesCacheDocument {
  id?: string;
  _id?: string;
  key: string;
  items: CommodityItem[];
  usdToBrl: number;
  updatedAt: Date;
  nextUpdateAt: Date;
  source: 'commodities-api' | 'cache' | 'fallback';
  rawRates?: Record<string, number>;
}
