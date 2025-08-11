/**
 * Simple Echo test utility
 * Add this to browser console to test Echo directly
 */

// Only run on client-side (not during SSR)
if (typeof window !== 'undefined') {
    window.testEcho = function() {
    console.group('🧪 Testing Echo Directly');
    
    // Check if Echo is available
    if (!window.Echo) {
        console.error('❌ Echo not available on window object');
        console.groupEnd();
        return;
    }
    
    // // console.log('✅ Echo found:', window.Echo);
    // // console.log('🔗 Connector:', window.Echo.connector);
    // // console.log('📡 Pusher:', window.Echo.connector?.pusher);
    // // console.log('🔌 Connection state:', window.Echo.connector?.pusher?.connection?.state);
    
    // Try to listen to our channel
    try {
        // // console.log('🎯 Attempting to listen to tiktok-accounts channel...');
        
        const channel = window.Echo.channel('tiktok-accounts');
        // // console.log('📺 Channel created:', channel);
        
        const listener = channel.listen('tiktok-accounts.reload', (data) => {
            console.group('🎉 Event Received via Direct Test!');
            // // console.log('📦 Data:', data);
            // // console.log('🕐 Time:', new Date().toLocaleString());
            console.groupEnd();
        });
        
        // // console.log('👂 Listener created:', listener);
        // // console.log('✅ Direct Echo test setup successful!');
        
        // Store reference for cleanup
        window.testEchoChannel = channel;
        window.testEchoListener = listener;
        
        // // console.log('💡 Now run: php artisan test:tiktok-realtime');
        
    } catch (error) {
        console.error('❌ Error in direct Echo test:', error);
    }
    
    console.groupEnd();
    };

    window.cleanupTestEcho = function() {
        if (window.testEchoChannel) {
            // // console.log('🧹 Cleaning up test Echo channel...');
            window.testEchoChannel.stopListening('tiktok-accounts.reload');
            delete window.testEchoChannel;
            delete window.testEchoListener;
            // // console.log('✅ Test Echo cleaned up');
        }
    };

    // // console.log('🧪 Echo test utilities loaded. Run window.testEcho() to test.');
}
