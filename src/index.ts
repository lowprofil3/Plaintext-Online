import { getSupabaseClient } from './config/supabaseClient';
import { createStartingPlayer } from './domain/player';
import { PlayerService } from './services/playerService';
import { StatRegenerationService } from './services/statRegenerationService';

function logBanner() {
  console.log('========================================');
  console.log('       PlainText Online Prototype        ');
  console.log('========================================');
}

async function main() {
  logBanner();
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn('Supabase credentials are not configured.');
    console.warn('Set SUPABASE_URL and SUPABASE_ANON_KEY to enable live auth.');
  } else {
    console.log('Supabase client initialised. Ready for auth calls.');
  }

  const regenerationService = new StatRegenerationService();

  const demoPlayer = createStartingPlayer('demo-user');
  console.log('\nNew citizens start their journey with:');
  console.table({
    Cash: `$${demoPlayer.stats.cash}`,
    Energy: demoPlayer.stats.energy,
    Focus: demoPlayer.stats.focus,
    Reputation: demoPlayer.stats.reputation,
    Assets: demoPlayer.assets.map((asset) => asset.name).join(', '),
  });

  const future = new Date(Date.now() + 45 * 60 * 1000);
  const regenResult = regenerationService.applyRegeneration(demoPlayer, future);
  console.log('\nAfter 45 minutes of downtime:');
  console.table({
    Energy: regenResult.updatedPlayer.stats.energy,
    Focus: regenResult.updatedPlayer.stats.focus,
    'Energy gained': regenResult.energyGained,
    'Focus gained': regenResult.focusGained,
  });

  if (supabase) {
    console.log('\nPlayer service API (example usage only):');
    const playerService = new PlayerService(supabase, regenerationService);
    console.log('- registerPlayer(credentials)');
    console.log('- login(credentials)');
    console.log('- fetchPlayerProfile(userId)');
    console.log('Connect this module to your terminal UI or API routes.');
  }
}

main().catch((error) => {
  console.error('Fatal error while bootstrapping PlainText Online prototype.');
  console.error(error);
  process.exit(1);
});
