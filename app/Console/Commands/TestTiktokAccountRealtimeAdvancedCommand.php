<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Events\TiktokAccountTableReload;
use App\Models\TiktokAccount;

class TestTiktokAccountRealtimeAdvancedCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:tiktok-realtime-advanced 
                            {--scenario=single : Test scenario (single, multiple, interval)}
                            {--count=5 : Number of events for multiple scenario}
                            {--delay=2 : Delay in seconds between events for interval scenario}
                            {--message= : Custom message}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Advanced testing for TikTok Account table realtime events with different scenarios';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $scenario = $this->option('scenario');
        $count = (int) $this->option('count');
        $delay = (int) $this->option('delay');
        $customMessage = $this->option('message');

        $this->info("🚀 Starting TikTok Account realtime test - Scenario: {$scenario}");
        $this->newLine();

        switch ($scenario) {
            case 'single':
                $this->testSingleEvent($customMessage);
                break;
                
            case 'multiple':
                $this->testMultipleEvents($count, $customMessage);
                break;
                
            case 'interval':
                $this->testIntervalEvents($count, $delay, $customMessage);
                break;
                
            default:
                $this->error("❌ Unknown scenario: {$scenario}");
                $this->line("Available scenarios: single, multiple, interval");
                return 1;
        }

        $this->newLine();
        $this->comment('💡 Tips:');
        $this->comment('- Open browser console to see realtime events');
        $this->comment('- Check if table reloads automatically');
        $this->comment('- Monitor Laravel logs for event broadcasting');
        
        return 0;
    }

    /**
     * Test single event
     */
    private function testSingleEvent(?string $customMessage = null)
    {
        $message = $customMessage ?? 'Single test reload event';
        
        $this->info("📤 Firing single event...");
        
        try {
            event(new TiktokAccountTableReload($message));
            
            $this->info("✅ Event fired successfully!");
            $this->line("📢 Message: {$message}");
            $this->line("🕐 Timestamp: " . now()->format('Y-m-d H:i:s'));
            
        } catch (\Exception $e) {
            $this->error("❌ Failed to fire event: " . $e->getMessage());
        }
    }

    /**
     * Test multiple events at once
     */
    private function testMultipleEvents(int $count, ?string $customMessage = null)
    {
        $this->info("📤 Firing {$count} events rapidly...");
        
        $successCount = 0;
        $failCount = 0;
        
        for ($i = 1; $i <= $count; $i++) {
            $message = $customMessage ?? "Bulk test event #{$i} of {$count}";
            
            try {
                event(new TiktokAccountTableReload($message));
                $successCount++;
                $this->line("✅ Event #{$i} fired");
                
            } catch (\Exception $e) {
                $failCount++;
                $this->error("❌ Event #{$i} failed: " . $e->getMessage());
            }
        }
        
        $this->newLine();
        $this->info("📊 Results: {$successCount} success, {$failCount} failed");
    }

    /**
     * Test events with intervals
     */
    private function testIntervalEvents(int $count, int $delay, ?string $customMessage = null)
    {
        $this->info("📤 Firing {$count} events with {$delay}s intervals...");
        $this->comment("⏳ This will take approximately " . ($count * $delay) . " seconds");
        $this->newLine();
        
        $successCount = 0;
        $failCount = 0;
        
        for ($i = 1; $i <= $count; $i++) {
            $message = $customMessage ?? "Interval test event #{$i} of {$count}";
            
            try {
                event(new TiktokAccountTableReload($message));
                $successCount++;
                $this->line("✅ Event #{$i} fired at " . now()->format('H:i:s'));
                
            } catch (\Exception $e) {
                $failCount++;
                $this->error("❌ Event #{$i} failed: " . $e->getMessage());
            }
            
            // Sleep between events (except for the last one)
            if ($i < $count) {
                $this->comment("⏳ Waiting {$delay} seconds...");
                sleep($delay);
            }
        }
        
        $this->newLine();
        $this->info("📊 Results: {$successCount} success, {$failCount} failed");
    }
}
