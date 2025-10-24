import type { Player } from './player';

export interface PlayerRow {
  id: string;
  user_id: string;
  username: string;
  username_changed_at: string;
  stats: Player['stats'];
  regeneration: Player['regeneration'];
  assets: Player['assets'];
  created_at: string;
  updated_at: string;
}

export type PlayerUpdate = Pick<PlayerRow, 'stats' | 'regeneration' | 'updated_at'>;

export function toPlayer(row: PlayerRow): Player {
  return {
    id: row.id,
    username: row.username,
    usernameChangedAt: row.username_changed_at,
    stats: { ...row.stats },
    assets: row.assets.map((asset) => ({ ...asset })),
    regeneration: { ...row.regeneration },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toPlayerRow(player: Player, userId: string): PlayerRow {
  return {
    id: player.id,
    user_id: userId,
    username: player.username,
    username_changed_at: player.usernameChangedAt,
    stats: { ...player.stats },
    regeneration: { ...player.regeneration },
    assets: player.assets.map((asset) => ({ ...asset })),
    created_at: player.createdAt,
    updated_at: player.updatedAt,
  };
}

export function toPlayerUpdate(player: Player): PlayerUpdate {
  return {
    stats: { ...player.stats },
    regeneration: { ...player.regeneration },
    updated_at: player.updatedAt,
  };
}
