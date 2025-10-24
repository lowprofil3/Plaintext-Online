import { SupabaseClient } from '@supabase/supabase-js';
import { createStartingPlayer } from '../domain/player';
import type { Player } from '../domain/player';
import { toPlayer, toPlayerRow, toPlayerUpdate, type PlayerRow } from '../domain/playerPersistence';
import { StatRegenerationService } from './statRegenerationService';

const SYNTHETIC_EMAIL_DOMAIN = 'players.plaintext-online.local';

export interface Credentials {
  username: string;
  password: string;
}

export interface RegistrationResult {
  player: Player;
  userId: string;
}

export class PlayerService {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly regenerationService = new StatRegenerationService(),
  ) {}

  async registerPlayer({ username, password }: Credentials): Promise<RegistrationResult> {
    const email = this.toSyntheticEmail(username);
    const signUpResult = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (signUpResult.error) {
      throw new Error(`Unable to register player: ${signUpResult.error.message}`);
    }

    const user = signUpResult.data.user;
    if (!user) {
      throw new Error('Supabase did not return a user record during registration.');
    }

    const playerProfile = createStartingPlayer(username);
    const { error: profileError } = await this.supabase
      .from('players')
      .insert(toPlayerRow(playerProfile, user.id));

    if (profileError) {
      throw new Error(`Unable to create player profile: ${profileError.message}`);
    }

    return {
      player: playerProfile,
      userId: user.id,
    };
  }

  async login({ username, password }: Credentials) {
    const email = this.toSyntheticEmail(username);
    const result = await this.supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      throw new Error(`Unable to log in: ${result.error.message}`);
    }

    return result.data;
  }

  async fetchPlayerProfile(userId: string): Promise<Player> {
    const { data, error } = await this.supabase
      .from('players')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(`Unable to load player profile: ${error.message}`);
    }

    if (!data) {
      throw new Error('Player profile was not found.');
    }

    const player = toPlayer(data as PlayerRow);
    const regenerationResult = this.regenerationService.applyRegeneration(player);
    if (regenerationResult.energyGained > 0 || regenerationResult.focusGained > 0) {
      await this.persistRegeneration(regenerationResult.updatedPlayer);
      return regenerationResult.updatedPlayer;
    }

    return player;
  }

  private async persistRegeneration(player: Player) {
    const { error } = await this.supabase
      .from('players')
      .update(toPlayerUpdate(player))
      .eq('id', player.id);

    if (error) {
      throw new Error(`Unable to persist regenerated stats: ${error.message}`);
    }
  }

  private toSyntheticEmail(username: string) {
    return `${username}@${SYNTHETIC_EMAIL_DOMAIN}`;
  }
}
