<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Events\TiktokAccountTableReload;

class TestTiktokAccountRealtimeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:tiktok-realtime {--message= : Custom message for the reload event}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test TikTok Account table realtime reload event';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Testing TikTok Account table realtime reload event...');
        
        // Get custom message or use default
        $message = $this->option('message') ?? 'Test reload event from command line';
        
        try {
            $this->info('🔥 Firing TiktokAccountTableReload event...');
            $this->line("📡 Channel: tiktok-accounts");
            $this->line("📢 Event: tiktok-accounts.reload");
            $this->line("💬 Message: {$message}");
            
            // Fire the reload event
            event(new TiktokAccountTableReload($message));
            
            $this->info('✅ Event fired successfully!');
            $this->line("🕐 Timestamp: " . now()->format('Y-m-d H:i:s'));
            
            $this->newLine();
            $this->comment('🔍 What to check in browser console:');
            $this->comment('1. Look for "🚀 [useRealtime] Echo Initialization Process"');
            $this->comment('2. Look for "🟢 [useRealtime] WebSocket connected successfully"');
            $this->comment('3. Look for "📡 [useTiktokAccountTableReload] Raw Socket Event Received"');
            $this->comment('4. Look for "🔄 [TiktokAccountListTable] Socket Event Received"');
            $this->comment('5. The table should reload automatically');
            
        } catch (\Exception $e) {
            $this->error('❌ Failed to fire event: ' . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
}
