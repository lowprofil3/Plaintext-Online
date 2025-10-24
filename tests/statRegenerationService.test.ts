import { describe, expect, it } from 'vitest';
import { createStartingPlayer } from '../src/domain/player';
import { StatRegenerationService } from '../src/services/statRegenerationService';

const service = new StatRegenerationService();

describe('StatRegenerationService', () => {
  it('regenerates energy and focus over elapsed time', () => {
    const player = createStartingPlayer('regen-test');
    player.stats.energy = 10;
    player.stats.focus = 10;

    const reference = new Date(
      new Date(player.regeneration.energyLastTickAt).getTime() + 60 * 60 * 1000,
    );
    const result = service.applyRegeneration(player, reference);

    expect(result.energyGained).toBe(60);
    expect(result.focusGained).toBe(12);
    expect(result.updatedPlayer.stats.energy).toBe(70);
    expect(result.updatedPlayer.stats.focus).toBe(22);
    expect(result.nextEnergyTickAt.getTime()).toBe(reference.getTime() + 5 * 60 * 1000);
    expect(result.nextFocusTickAt.getTime()).toBe(reference.getTime() + 10 * 60 * 1000);
  });

  it('does not regenerate when insufficient time has passed', () => {
    const player = createStartingPlayer('no-regen');
    player.stats.energy = 40;
    player.stats.focus = 45;

    const reference = new Date(new Date(player.regeneration.energyLastTickAt).getTime() + 60 * 1000);
    const result = service.applyRegeneration(player, reference);

    expect(result.energyGained).toBe(0);
    expect(result.focusGained).toBe(0);
    expect(result.updatedPlayer.stats.energy).toBe(40);
    expect(result.updatedPlayer.stats.focus).toBe(45);
  });
});
