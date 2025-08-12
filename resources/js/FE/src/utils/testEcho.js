// Test utility for Echo connection
// This file can be imported dynamically to test Echo status

import { initializeEcho, getEcho } from './echo';

/**
 * Test Echo connection and return status
 */
export const testEchoConnection = async () => {
    console.group('🧪 [testEcho] Testing Echo Connection');
    
    try {
        // Try to initialize Echo
        const echo = await initializeEcho();
        
        if (echo) {
            console.log('✅ [testEcho] Echo initialized successfully');
            
            // Check connection status
            const connection = echo.connector?.pusher?.connection;
            if (connection) {
                // console.log('🔗 [testEcho] Connection state:', connection.state);
                // console.log('📡 [testEcho] Socket ID:', connection.socket_id);
            }
            
            // Test public channel
            try {
                const testChannel = echo.channel('test-channel');
                console.log('✅ [testEcho] Public channel creation successful');
            } catch (error) {
                console.error('❌ [testEcho] Public channel creation failed:', error);
            }
            
            return {
                success: true,
                echo: echo,
                connectionState: connection?.state,
                socketId: connection?.socket_id
            };
        } else {
            console.error('❌ [testEcho] Echo initialization failed');
            return {
                success: false,
                error: 'Echo initialization failed'
            };
        }
    } catch (error) {
        console.error('❌ [testEcho] Error during test:', error);
        return {
            success: false,
            error: error.message
        };
    } finally {
        console.groupEnd();
    }
};

/**
 * Test Echo with manual token
 */
export const testEchoWithToken = async (token) => {
    console.group('🧪 [testEcho] Testing Echo with Manual Token');
    
    try {
        const echo = await initializeEcho(token);
        
        if (echo) {
            console.log('✅ [testEcho] Echo initialized with manual token');
            return {
                success: true,
                echo: echo
            };
        } else {
            console.error('❌ [testEcho] Echo initialization with manual token failed');
            return {
                success: false,
                error: 'Echo initialization with manual token failed'
            };
        }
    } catch (error) {
        console.error('❌ [testEcho] Error during manual token test:', error);
        return {
            success: false,
            error: error.message
        };
    } finally {
        console.groupEnd();
    }
};

/**
 * Get current Echo status
 */
export const getEchoStatus = () => {
    const echo = getEcho();
    const connectionState = echo?.connector?.pusher?.connection?.state || 'unknown';
    const socketId = echo?.connector?.pusher?.connection?.socket_id || null;
    
    console.group('📊 [testEcho] Current Echo Status');
    console.log('Echo instance:', !!echo);
    console.log('Connection state:', connectionState);
    console.log('Socket ID:', socketId);
    console.groupEnd();
    
    return {
        echo: !!echo,
        connectionState,
        socketId
    };
};

// Auto-run test if imported directly
if (typeof window !== 'undefined') {
    // Wait a bit for the page to load
    setTimeout(() => {
        console.log('🧪 [testEcho] Auto-running Echo test...');
        testEchoConnection();
    }, 2000);
}
