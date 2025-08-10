<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Events\TiktokAccountTableReload;

class TestEchoEventFormatsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:echo-formats {--delay=3 : Delay between events in seconds}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test different event name formats to see which one works with Echo';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $delay = (int) $this->option('delay');
        
        $this->info('🧪 Testing different event name formats with Echo...');
        $this->newLine();
        
        $this->comment('📋 Instructions:');
        $this->comment('1. Open browser console on TikTok Account Management page');
        $this->comment('2. Run: window.testEcho() to set up direct Echo listener');
        $this->comment('3. Watch for events in console');
        $this->newLine();
        
        $this->comment('🔍 What to watch for in browser console:');
        $this->comment('- "🎉 Event Received via Direct Test!" - means Echo is working');
        $this->comment('- "📡 [useTiktokAccountTableReload] Raw Socket Event Received" - means hook is working');
        $this->comment('- "🔄 [TiktokAccountListTable] Socket Event Received" - means table integration is working');
        $this->newLine();
        
        // Fire a test event
        $this->info('🔥 Firing test event...');
        $this->line("📡 Channel: tiktok-accounts");
        $this->line("📢 Event: tiktok-accounts.reload");
        $this->line("💬 Message: Test event from echo-formats command");
        
        try {
            event(new TiktokAccountTableReload("Test event from echo-formats command"));
            
            $this->info('✅ Event fired successfully!');
            $this->line("🕐 Timestamp: " . now()->format('H:i:s'));
            
        } catch (\Exception $e) {
            $this->error('❌ Failed to fire event: ' . $e->getMessage());
            return 1;
        }
        
        $this->newLine();
        $this->comment('🎯 Expected behavior:');
        $this->comment('1. Direct Echo test should receive the event');
        $this->comment('2. If direct test works but hook doesn\'t, there\'s an issue with the hook');
        $this->comment('3. If neither works, there\'s an issue with Echo/WebSocket connection');
        
        $this->newLine();
        $this->comment('🔧 Troubleshooting:');
        $this->comment('- If direct test fails: Check Echo initialization and WebSocket connection');
        $this->comment('- If direct test works but hook fails: Check useRealtime hook implementation');
        $this->comment('- Run: window.cleanupTestEcho() when done testing');
        
        return 0;
    }
}
