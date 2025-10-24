import crypto from 'node:crypto';
import { PlayerAsset, SMALL_APARTMENT } from './assets';

export interface PlayerStats {
  energy: number;
  focus: number;
  reputation: number;
  cash: number;
}

export interface RegenerationState {
  energyLastTickAt: string;
  focusLastTickAt: string;
}

export interface Player {
  id: string;
  username: string;
  stats: PlayerStats;
  assets: PlayerAsset[];
  regeneration: RegenerationState;
  createdAt: string;
  updatedAt: string;
}

export const STARTING_PLAYER_STATS: PlayerStats = {
  energy: 50,
  focus: 50,
  reputation: 0,
  cash: 200,
};

export function createStartingPlayer(username: string): Player {
  const now = new Date().toISOString();
  const apartment: PlayerAsset = {
    assetId: SMALL_APARTMENT.id,
    name: SMALL_APARTMENT.name,
    category: SMALL_APARTMENT.category,
    description: SMALL_APARTMENT.description,
    baseValue: SMALL_APARTMENT.baseValue,
    acquiredAt: now,
  };

  return {
    id: crypto.randomUUID(),
    username,
    stats: { ...STARTING_PLAYER_STATS },
    assets: [apartment],
    regeneration: {
      energyLastTickAt: now,
      focusLastTickAt: now,
    },
    createdAt: now,
    updatedAt: now,
  };
}
