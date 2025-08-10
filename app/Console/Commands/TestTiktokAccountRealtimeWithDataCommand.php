<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Events\TiktokAccountTableReload;
use App\Models\TiktokAccount;
use App\Services\TiktokAccountService;

class TestTiktokAccountRealtimeWithDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:tiktok-realtime-data 
                            {--action=reload : Action to test (reload, create, update, delete)}
                            {--account-id= : Specific account ID for update/delete actions}
                            {--fake-data : Create fake account for testing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test TikTok Account realtime events with actual data operations';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->option('action');
        $accountId = $this->option('account-id');
        $useFakeData = $this->option('fake-data');

        $this->info("🚀 Testing TikTok Account realtime with data operations");
        $this->line("Action: {$action}");
        $this->newLine();

        try {
            switch ($action) {
                case 'reload':
                    $this->testReloadEvent();
                    break;
                    
                case 'create':
                    $this->testCreateAccount($useFakeData);
                    break;
                    
                case 'update':
                    $this->testUpdateAccount($accountId);
                    break;
                    
                case 'delete':
                    $this->testDeleteAccount($accountId);
                    break;
                    
                default:
                    $this->error("❌ Unknown action: {$action}");
                    $this->line("Available actions: reload, create, update, delete");
                    return 1;
            }
            
        } catch (\Exception $e) {
            $this->error("❌ Test failed: " . $e->getMessage());
            return 1;
        }

        $this->newLine();
        $this->comment('💡 Check your browser to see if the table reloaded automatically!');
        
        return 0;
    }

    /**
     * Test simple reload event
     */
    private function testReloadEvent()
    {
        $this->info("📤 Testing simple reload event...");
        
        event(new TiktokAccountTableReload('Manual reload test from command'));
        
        $this->info("✅ Reload event fired successfully!");
        $this->line("🕐 Timestamp: " . now()->format('Y-m-d H:i:s'));
    }

    /**
     * Test create account with event
     */
    private function testCreateAccount(bool $useFakeData = false)
    {
        $this->info("📤 Testing create account with realtime event...");
        
        if ($useFakeData) {
            // Create fake account data
            $data = [
                'username' => 'test_user_' . time(),
                'email' => 'test' . time() . '@example.com',
                'phone' => '0' . rand(100000000, 999999999),
                'password' => 'test123456',
                'status' => 'active',
                'notes' => 'Test account created by command at ' . now()->format('Y-m-d H:i:s')
            ];
            
            $account = TiktokAccount::create($data);
            
            // Fire reload event manually since we're not using service
            event(new TiktokAccountTableReload("New test account '{$account->username}' has been created"));
            
            $this->info("✅ Test account created successfully!");
            $this->line("👤 Username: {$account->username}");
            $this->line("📧 Email: {$account->email}");
            $this->line("🆔 ID: {$account->id}");
            
        } else {
            $this->comment("💡 Use --fake-data flag to create a test account");
            $this->comment("Example: php artisan test:tiktok-realtime-data --action=create --fake-data");
        }
    }

    /**
     * Test update account with event
     */
    private function testUpdateAccount(?string $accountId = null)
    {
        $this->info("📤 Testing update account with realtime event...");
        
        if (!$accountId) {
            // Get first available account
            $account = TiktokAccount::first();
            if (!$account) {
                $this->error("❌ No accounts found in database");
                return;
            }
        } else {
            $account = TiktokAccount::find($accountId);
            if (!$account) {
                $this->error("❌ Account with ID {$accountId} not found");
                return;
            }
        }
        
        // Update account notes with timestamp
        $oldNotes = $account->notes;
        $newNotes = "Updated by test command at " . now()->format('Y-m-d H:i:s');
        
        $account->update(['notes' => $newNotes]);
        
        // Fire reload event
        event(new TiktokAccountTableReload("Account '{$account->username}' has been updated"));
        
        $this->info("✅ Account updated successfully!");
        $this->line("👤 Username: {$account->username}");
        $this->line("🆔 ID: {$account->id}");
        $this->line("📝 Old notes: " . ($oldNotes ?: 'None'));
        $this->line("📝 New notes: {$newNotes}");
    }

    /**
     * Test delete account with event
     */
    private function testDeleteAccount(?string $accountId = null)
    {
        $this->info("📤 Testing delete account with realtime event...");
        
        if (!$accountId) {
            $this->error("❌ Account ID is required for delete action");
            $this->comment("Example: php artisan test:tiktok-realtime-data --action=delete --account-id=123");
            return;
        }
        
        $account = TiktokAccount::find($accountId);
        if (!$account) {
            $this->error("❌ Account with ID {$accountId} not found");
            return;
        }
        
        // Confirm deletion
        if (!$this->confirm("Are you sure you want to delete account '{$account->username}' (ID: {$account->id})?")) {
            $this->comment("❌ Deletion cancelled");
            return;
        }
        
        $username = $account->username;
        $account->delete();
        
        // Fire reload event
        event(new TiktokAccountTableReload("Account '{$username}' has been deleted"));
        
        $this->info("✅ Account deleted successfully!");
        $this->line("👤 Deleted username: {$username}");
        $this->line("🆔 Deleted ID: {$accountId}");
    }
}
