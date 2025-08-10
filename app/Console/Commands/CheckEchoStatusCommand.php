<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CheckEchoStatusCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:echo-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check Echo/WebSocket configuration and status';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Checking Echo/WebSocket Configuration...');
        $this->newLine();
        
        // Check broadcasting configuration
        $this->checkBroadcastingConfig();
        
        // Check Reverb server status
        $this->checkReverbServer();
        
        // Check authentication configuration
        $this->checkAuthConfig();
        
        // Check environment variables
        $this->checkEnvironmentVariables();
        
        // Provide troubleshooting steps
        $this->provideTroubleshootingSteps();
        
        return 0;
    }
    
    /**
     * Check broadcasting configuration
     */
    private function checkBroadcastingConfig()
    {
        $this->info('1. 📡 Broadcasting Configuration');
        
        $driver = config('broadcasting.default');
        $this->line("   Default driver: {$driver}");
        
        if ($driver === 'reverb') {
            $this->info('   ✅ Broadcasting driver is correctly set to reverb');
        } else {
            $this->error('   ❌ Broadcasting driver should be "reverb"');
            $this->comment('   💡 Set BROADCAST_DRIVER=reverb in .env');
        }
        
        $reverbConfig = config('broadcasting.connections.reverb');
        if ($reverbConfig) {
            $this->info('   ✅ Reverb configuration found');
            $this->line('   🔑 App ID: ' . ($reverbConfig['app_id'] ?? 'Not set'));
            $this->line('   🔐 Key: ' . ($reverbConfig['key'] ?? 'Not set'));
            $this->line('   🏠 Host: ' . ($reverbConfig['host'] ?? 'Not set'));
            $this->line('   🔌 Port: ' . ($reverbConfig['port'] ?? 'Not set'));
        } else {
            $this->error('   ❌ Reverb configuration not found');
        }
        
        $this->newLine();
    }
    
    /**
     * Check Reverb server status
     */
    private function checkReverbServer()
    {
        $this->info('2. 🚀 Reverb Server Status');
        
        $host = config('broadcasting.connections.reverb.host', '127.0.0.1');
        $port = config('broadcasting.connections.reverb.port', 8080);
        
        $this->line("   Checking {$host}:{$port}...");
        
        $connection = @fsockopen($host, $port, $errno, $errstr, 5);
        
        if ($connection) {
            $this->info('   ✅ Reverb server is running');
            fclose($connection);
        } else {
            $this->error('   ❌ Cannot connect to Reverb server');
            $this->comment('   💡 Run: php artisan reverb:start');
        }
        
        $this->newLine();
    }
    
    /**
     * Check authentication configuration
     */
    private function checkAuthConfig()
    {
        $this->info('3. 🔐 Authentication Configuration');
        
        $authGuard = config('auth.defaults.guard');
        $this->line("   Default guard: {$authGuard}");
        
        $sessionDriver = config('session.driver');
        $this->line("   Session driver: {$sessionDriver}");
        
        if (config('auth.providers.users')) {
            $this->info('   ✅ User provider configured');
        } else {
            $this->error('   ❌ User provider not configured');
        }
        
        // Check NextAuth configuration
        if (env('NEXTAUTH_SECRET')) {
            $this->info('   ✅ NEXTAUTH_SECRET is set');
        } else {
            $this->error('   ❌ NEXTAUTH_SECRET not set');
            $this->comment('   💡 Set NEXTAUTH_SECRET in .env');
        }
        
        $this->newLine();
    }
    
    /**
     * Check environment variables
     */
    private function checkEnvironmentVariables()
    {
        $this->info('4. 🌍 Environment Variables');
        
        $requiredVars = [
            'BROADCAST_DRIVER' => 'reverb',
            'REVERB_APP_ID' => null,
            'REVERB_APP_KEY' => null,
            'REVERB_APP_SECRET' => null,
            'REVERB_HOST' => '127.0.0.1',
            'REVERB_PORT' => '8080',
            'NEXTAUTH_SECRET' => null,
        ];
        
        foreach ($requiredVars as $var => $expectedValue) {
            $value = env($var);
            
            if ($value) {
                if ($expectedValue && $value !== $expectedValue) {
                    $this->warn("   ⚠️ {$var}: {$value} (expected: {$expectedValue})");
                } else {
                    $this->info("   ✅ {$var}: " . (strlen($value) > 20 ? substr($value, 0, 20) . '...' : $value));
                }
            } else {
                $this->error("   ❌ {$var}: Not set");
            }
        }
        
        $this->newLine();
    }
    
    /**
     * Provide troubleshooting steps
     */
    private function provideTroubleshootingSteps()
    {
        $this->comment('🔧 Troubleshooting Steps:');
        $this->newLine();
        
        $this->comment('If Echo is not initializing:');
        $this->line('1. Check if user is authenticated (NextAuth session)');
        $this->line('2. Check browser console for authentication errors');
        $this->line('3. Verify NEXTAUTH_SECRET is set and valid');
        $this->line('4. Check if session data includes accessToken');
        $this->newLine();
        
        $this->comment('If Reverb server is not running:');
        $this->line('1. Run: php artisan reverb:start');
        $this->line('2. Check if port 8080 is available');
        $this->line('3. Verify REVERB_* environment variables');
        $this->newLine();
        
        $this->comment('If events are not received:');
        $this->line('1. Check routes/channels.php for channel definitions');
        $this->line('2. Verify event is being fired from backend');
        $this->line('3. Check browser Network tab for WebSocket connection');
        $this->line('4. Test with: php artisan test:tiktok-realtime');
        $this->newLine();
        
        $this->comment('Debug commands:');
        $this->line('• php artisan check:reverb-connection');
        $this->line('• php artisan test:echo-formats');
        $this->line('• php artisan test:tiktok-realtime');
    }
}
