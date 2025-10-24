import { SupabaseClient } from '@supabase/supabase-js';
import { createStartingPlayer } from '../domain/player';
import type { Player } from '../domain/player';
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

    const playerProfile = createStartingPlayer(username);
    const { error: profileError } = await this.supabase.from('players').insert({
      id: playerProfile.id,
      user_id: signUpResult.data.user?.id,
      username: playerProfile.username,
      stats: playerProfile.stats,
      regeneration: playerProfile.regeneration,
      assets: playerProfile.assets,
      created_at: playerProfile.createdAt,
      updated_at: playerProfile.updatedAt,
    });

    if (profileError) {
      throw new Error(`Unable to create player profile: ${profileError.message}`);
    }

    return {
      player: playerProfile,
      userId: signUpResult.data.user!.id,
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

    const regenerationResult = this.regenerationService.applyRegeneration(data as Player);
    if (regenerationResult.energyGained > 0 || regenerationResult.focusGained > 0) {
      await this.persistRegeneration(regenerationResult.updatedPlayer);
      return regenerationResult.updatedPlayer;
    }

    return data as Player;
  }

  private async persistRegeneration(player: Player) {
    const { error } = await this.supabase
      .from('players')
      .update({
        stats: player.stats,
        regeneration: player.regeneration,
        updated_at: player.updatedAt,
      })
      .eq('id', player.id);

    if (error) {
      throw new Error(`Unable to persist regenerated stats: ${error.message}`);
    }
  }

  private toSyntheticEmail(username: string) {
    return `${username}@${SYNTHETIC_EMAIL_DOMAIN}`;
  }
}
