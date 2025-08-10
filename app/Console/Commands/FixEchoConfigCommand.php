<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class FixEchoConfigCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:echo-config {--force : Force overwrite existing values}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix Echo/WebSocket configuration issues automatically';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔧 Fixing Echo/WebSocket Configuration...');
        $this->newLine();
        
        $force = $this->option('force');
        
        // Check and fix .env file
        $this->fixEnvFile($force);
        
        // Check and fix config cache
        $this->clearConfigCache();
        
        // Verify fixes
        $this->verifyConfiguration();
        
        $this->newLine();
        $this->info('✅ Configuration fix completed!');
        $this->comment('💡 Please restart your development server and refresh the browser.');
        
        return 0;
    }
    
    /**
     * Fix .env file configuration
     */
    private function fixEnvFile($force = false)
    {
        $this->info('1. 📝 Checking .env file...');
        
        $envPath = base_path('.env');
        
        if (!file_exists($envPath)) {
            $this->error('   ❌ .env file not found');
            $this->comment('   💡 Copy .env.example to .env first');
            return;
        }
        
        $envContent = file_get_contents($envPath);
        $modified = false;
        
        // Fix BROADCAST_DRIVER
        if (!str_contains($envContent, 'BROADCAST_DRIVER=') || $force) {
            if (str_contains($envContent, 'BROADCAST_DRIVER=')) {
                $envContent = preg_replace('/BROADCAST_DRIVER=.*/', 'BROADCAST_DRIVER=reverb', $envContent);
                $this->info('   ✅ Updated BROADCAST_DRIVER=reverb');
            } else {
                $envContent .= "\nBROADCAST_DRIVER=reverb\n";
                $this->info('   ✅ Added BROADCAST_DRIVER=reverb');
            }
            $modified = true;
        } else {
            $this->info('   ✅ BROADCAST_DRIVER already set');
        }
        
        // Fix NEXTAUTH_SECRET
        if (!str_contains($envContent, 'NEXTAUTH_SECRET=') || $force) {
            $secret = bin2hex(random_bytes(32));
            if (str_contains($envContent, 'NEXTAUTH_SECRET=')) {
                $envContent = preg_replace('/NEXTAUTH_SECRET=.*/', "NEXTAUTH_SECRET={$secret}", $envContent);
                $this->info('   ✅ Updated NEXTAUTH_SECRET');
            } else {
                $envContent .= "\nNEXTAUTH_SECRET={$secret}\n";
                $this->info('   ✅ Added NEXTAUTH_SECRET');
            }
            $modified = true;
        } else {
            $this->info('   ✅ NEXTAUTH_SECRET already set');
        }
        
        // Fix REVERB_HOST if needed
        if (str_contains($envContent, 'REVERB_HOST=localhost')) {
            $envContent = str_replace('REVERB_HOST=localhost', 'REVERB_HOST=127.0.0.1', $envContent);
            $this->info('   ✅ Updated REVERB_HOST to 127.0.0.1');
            $modified = true;
        }
        
        // Save changes
        if ($modified) {
            file_put_contents($envPath, $envContent);
            $this->info('   💾 .env file updated');
        } else {
            $this->info('   ✅ .env file is already configured correctly');
        }
    }
    
    /**
     * Clear config cache
     */
    private function clearConfigCache()
    {
        $this->info('2. 🧹 Clearing configuration cache...');
        
        try {
            $this->call('config:clear');
            $this->info('   ✅ Configuration cache cleared');
        } catch (\Exception $e) {
            $this->warn('   ⚠️ Could not clear config cache: ' . $e->getMessage());
        }
    }
    
    /**
     * Verify configuration
     */
    private function verifyConfiguration()
    {
        $this->info('3. ✅ Verifying configuration...');
        
        // Re-read config after clearing cache
        $broadcastDriver = config('broadcasting.default');
        $nextAuthSecret = env('NEXTAUTH_SECRET');
        $reverbHost = env('REVERB_HOST');
        
        if ($broadcastDriver === 'reverb') {
            $this->info('   ✅ BROADCAST_DRIVER: reverb');
        } else {
            $this->error('   ❌ BROADCAST_DRIVER: ' . ($broadcastDriver ?: 'not set'));
        }
        
        if ($nextAuthSecret) {
            $this->info('   ✅ NEXTAUTH_SECRET: configured');
        } else {
            $this->error('   ❌ NEXTAUTH_SECRET: not set');
        }
        
        if ($reverbHost === '127.0.0.1') {
            $this->info('   ✅ REVERB_HOST: 127.0.0.1');
        } else {
            $this->warn('   ⚠️ REVERB_HOST: ' . ($reverbHost ?: 'not set'));
        }
    }
}
