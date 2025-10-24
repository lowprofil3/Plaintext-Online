import type { Player, RegenerationState } from '../domain/player';
import { clamp, minutesBetween, toDate } from '../utils/time';

export interface RegenerationRate {
  stat: 'energy' | 'focus';
  amountPerTick: number;
  intervalMinutes: number;
}

const ENERGY_REGEN_RATE: RegenerationRate = {
  stat: 'energy',
  amountPerTick: 5,
  intervalMinutes: 5,
};

const FOCUS_REGEN_RATE: RegenerationRate = {
  stat: 'focus',
  amountPerTick: 2,
  intervalMinutes: 10,
};

export interface RegenerationResult {
  energyGained: number;
  focusGained: number;
  updatedPlayer: Player;
  nextEnergyTickAt: Date;
  nextFocusTickAt: Date;
}

export class StatRegenerationService {
  applyRegeneration(player: Player, referenceDate = new Date()): RegenerationResult {
    const energyResult = this.processRate(
      player,
      ENERGY_REGEN_RATE,
      toDate(player.regeneration.energyLastTickAt),
      referenceDate,
      player.stats.energy,
      100,
    );

    const focusResult = this.processRate(
      energyResult.updatedPlayer,
      FOCUS_REGEN_RATE,
      toDate(energyResult.updatedPlayer.regeneration.focusLastTickAt),
      referenceDate,
      energyResult.updatedPlayer.stats.focus,
      100,
    );

    return {
      energyGained: energyResult.amountGained,
      focusGained: focusResult.amountGained,
      updatedPlayer: focusResult.updatedPlayer,
      nextEnergyTickAt: energyResult.nextTick,
      nextFocusTickAt: focusResult.nextTick,
    };
  }

  private processRate(
    player: Player,
    rate: RegenerationRate,
    lastTick: Date,
    referenceDate: Date,
    currentValue: number,
    maxValue: number,
  ) {
    const elapsedMinutes = minutesBetween(lastTick, referenceDate);
    const ticks = Math.floor(elapsedMinutes / rate.intervalMinutes);

    if (ticks <= 0 || currentValue >= maxValue) {
      return {
        updatedPlayer: player,
        amountGained: 0,
        nextTick: new Date(lastTick.getTime() + rate.intervalMinutes * 60 * 1000),
      };
    }

    const amountGained = clamp(ticks * rate.amountPerTick, 0, maxValue - currentValue);
    const nextTickTime = new Date(
      lastTick.getTime() + (ticks + 1) * rate.intervalMinutes * 60 * 1000,
    );

    const regenKey = `${rate.stat}LastTickAt` as keyof RegenerationState;

    const updatedPlayer: Player = {
      ...player,
      stats: {
        ...player.stats,
        [rate.stat]: currentValue + amountGained,
      },
      regeneration: {
        ...player.regeneration,
        [regenKey]: referenceDate.toISOString(),
      },
      updatedAt: referenceDate.toISOString(),
    };

    return {
      updatedPlayer,
      amountGained,
      nextTick: nextTickTime,
    };
  }
}
