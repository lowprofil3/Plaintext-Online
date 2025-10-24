import { describe, expect, it } from 'vitest';
import { SMALL_APARTMENT } from '../src/domain/assets';
import { createStartingPlayer, STARTING_PLAYER_STATS } from '../src/domain/player';
import { toPlayer, toPlayerRow, toPlayerUpdate } from '../src/domain/playerPersistence';

describe('createStartingPlayer', () => {
  it('initialises stats, timestamps, and starter asset', () => {
    const player = createStartingPlayer('citizen');

    expect(player.username).toBe('citizen');
    expect(player.stats).toEqual(STARTING_PLAYER_STATS);
    expect(player.stats).not.toBe(STARTING_PLAYER_STATS);
    expect(player.assets).toHaveLength(1);
    expect(player.assets[0]).toMatchObject({
      assetId: SMALL_APARTMENT.id,
      name: SMALL_APARTMENT.name,
    });
    expect(player.assets[0]).not.toBe(SMALL_APARTMENT);
    expect(player.regeneration.energyLastTickAt).toBe(player.regeneration.focusLastTickAt);
    expect(player.usernameChangedAt).toBe(player.createdAt);
    expect(player.createdAt).toBe(player.updatedAt);
  });
});

describe('player persistence helpers', () => {
  it('round-trips between domain and persistence shapes', () => {
    const player = createStartingPlayer('roundtrip');
    const row = toPlayerRow(player, 'user-123');
    const domainAgain = toPlayer(row);

    expect(row.user_id).toBe('user-123');
    expect(domainAgain).toEqual(player);
  });

  it('builds partial updates for stat regeneration', () => {
    const player = createStartingPlayer('updater');
    player.stats.energy = 80;
    player.updatedAt = new Date().toISOString();

    const update = toPlayerUpdate(player);
    expect(update).toEqual({
      stats: player.stats,
      regeneration: player.regeneration,
      updated_at: player.updatedAt,
    });
  });
});
