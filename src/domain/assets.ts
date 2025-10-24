export type AssetCategory = 'housing' | 'vehicle' | 'business';

export interface AssetDefinition {
  id: string;
  name: string;
  category: AssetCategory;
  description: string;
  baseValue: number;
}

export interface PlayerAsset {
  assetId: string;
  name: string;
  category: AssetCategory;
  description: string;
  baseValue: number;
  acquiredAt: string;
  notes?: string;
}

export const SMALL_APARTMENT: AssetDefinition = {
  id: 'small-apartment',
  name: 'Small Apartment',
  category: 'housing',
  description: 'A modest studio that keeps the rain out and the bills low.',
  baseValue: 175000,
};
