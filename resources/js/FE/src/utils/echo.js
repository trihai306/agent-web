import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Laravel Echo (only on client-side)
if (typeof window !== 'undefined') {
    window.Pusher = Pusher;
}

let echoInstance = null;

/**
 * Initialize Laravel Echo with Reverb configuration
 */
export const initializeEcho = (authToken) => {
    // Only initialize on client-side
    if (typeof window === 'undefined') {
        return null;
    }

    if (echoInstance) {
        return echoInstance;
    }

    try {
        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'app-key',
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
            wsPort: process.env.NEXT_PUBLIC_REVERB_PORT || 8080,
            wssPort: process.env.NEXT_PUBLIC_REVERB_PORT || 8080,
            forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === 'https',
            enabledTransports: ['ws', 'wss'],
            auth: {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            },
            authEndpoint: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/broadcasting/auth`,
        });

        // Add connection event listeners
        echoInstance.connector.pusher.connection.bind('connected', () => {
            console.log('✅ Echo connected to Reverb server');
        });

        echoInstance.connector.pusher.connection.bind('disconnected', () => {
            console.log('❌ Echo disconnected from Reverb server');
        });

        echoInstance.connector.pusher.connection.bind('error', (error) => {
            console.error('❌ Echo connection error:', error);
        });

        return echoInstance;
    } catch (error) {
        console.error('Failed to initialize Echo:', error);
        return null;
    }
};

/**
 * Get the current Echo instance
 */
export const getEcho = () => {
    return echoInstance;
};

/**
 * Disconnect Echo
 */
export const disconnectEcho = () => {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
        console.log('Echo disconnected');
    }
};

/**
 * Listen to a public channel
 */
export const listenToChannel = (channelName, eventName, callback) => {
    if (typeof window === 'undefined') {
        return null;
    }

    if (!echoInstance) {
        console.warn('Echo not initialized. Call initializeEcho() first.');
        return null;
    }

    return echoInstance.channel(channelName).listen(eventName, callback);
};

/**
 * Listen to a private channel
 */
export const listenToPrivateChannel = (channelName, eventName, callback) => {
    if (typeof window === 'undefined') {
        return null;
    }

    if (!echoInstance) {
        console.warn('Echo not initialized. Call initializeEcho() first.');
        return null;
    }

    return echoInstance.private(channelName).listen(eventName, callback);
};

/**
 * Leave a channel
 */
export const leaveChannel = (channelName) => {
    if (typeof window === 'undefined' || !echoInstance) {
        return;
    }

    echoInstance.leaveChannel(channelName);
};

/**
 * Leave all channels
 */
export const leaveAllChannels = () => {
    if (typeof window === 'undefined' || !echoInstance) {
        return;
    }

    // Get all channels and leave them
    Object.keys(echoInstance.connector.channels).forEach(channelName => {
        echoInstance.leaveChannel(channelName);
    });
};

export default {
    initializeEcho,
    getEcho,
    disconnectEcho,
    listenToChannel,
    listenToPrivateChannel,
    leaveChannel,
    leaveAllChannels,
};