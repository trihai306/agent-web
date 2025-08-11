import { useEffect, useRef, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
    initializeEcho, 
    getEcho, 
    disconnectEcho, 
    listenToChannel as echoListenToChannel, 
    listenToPrivateChannel as echoListenToPrivateChannel,
    leaveChannel,
    leaveAllChannels 
} from '../echo';

/**
 * Custom hook for managing real-time connections with Laravel Reverb
 */
export const useRealtime = () => {
    const { data: session } = useSession();
    const echoRef = useRef(null);
    const listenersRef = useRef(new Map());

    // Initialize Echo when session is available (client-side only)
    useEffect(() => {
        if (typeof window === 'undefined') {
            // // console.log('🚫 [useRealtime] Server-side rendering, skipping Echo initialization');
            return;
        }

        const initEcho = async () => {
            console.group('🚀 [useRealtime] Echo Initialization Process');
            
            if (session?.accessToken && !echoRef.current) {
                
                try {
                    echoRef.current = await initializeEcho(session.accessToken);
                    } catch (error) {
                }
            } else if (session && !session.accessToken) {
                
                
                // Thử khởi tạo Echo mà không có token (cho public channels)
                if (!echoRef.current) {
                    try {
                        echoRef.current = await initializeEcho();
                    } catch (error) {
                    }
                }
            }
            
            // Add connection event listeners for debugging
            if (echoRef.current?.connector?.pusher?.connection) {
                const connection = echoRef.current.connector.pusher.connection;
                
                connection.bind('connected', () => {
                    // WebSocket connected
                });
                
                connection.bind('disconnected', () => {
                    // WebSocket disconnected
                });
                
                connection.bind('error', (error) => {
                });
            }
        };

        initEcho();

        return () => {
            if (echoRef.current) {
                leaveAllChannels();
                disconnectEcho();
                echoRef.current = null;
                listenersRef.current.clear();
            }
        };
    }, [session]);

    /**
     * Listen to a public channel
     */
    const listenToPublicChannel = useCallback((channelName, eventName, callback) => {
        if (typeof window === 'undefined') {
            return null;
        }

        if (!echoRef.current) {
            return null;
        }

        // Validate parameters
        if (!channelName || typeof channelName !== 'string') {
            return null;
        }

        if (!eventName || typeof eventName !== 'string') {
            return null;
        }

        if (!callback || typeof callback !== 'function') {
            console.error('❌ [useRealtime] Invalid callback:', callback);
            return null;
        }

        // // console.log(`🎯 [useRealtime] Setting up public channel listener: ${channelName} -> ${eventName}`);
        
        const listenerKey = `${channelName}:${eventName}`;
        
        // Remove existing listener if any
        if (listenersRef.current.has(listenerKey)) {
            // // console.log(`🔄 [useRealtime] Removing existing listener for: ${listenerKey}`);
            const existingListener = listenersRef.current.get(listenerKey);
            existingListener.stopListening();
        }

        // Add new listener (use direct echo instance instead of async helper)
        // // console.log(`👂 [useRealtime] Creating listener for channel: ${channelName}, event: ${eventName}`);
        // // console.log(`🔍 [useRealtime] Echo instance:`, echoRef.current);
        // // console.log(`🔍 [useRealtime] Echo connector:`, echoRef.current?.connector);
        // // console.log(`🔍 [useRealtime] Connection state:`, echoRef.current?.connector?.pusher?.connection?.state);
        
        try {
            // // console.log(`🔍 [useRealtime] About to create channel with name: "${channelName}"`);
            // // console.log(`🔍 [useRealtime] Channel name type:`, typeof channelName);
            // // console.log(`🔍 [useRealtime] Channel name length:`, channelName?.length);
            
            const channel = echoRef.current.channel(channelName);
            // // console.log(`🔍 [useRealtime] Channel created:`, channel);
            
            // // console.log(`🔍 [useRealtime] About to listen to event: "${eventName}"`);
            // // console.log(`🔍 [useRealtime] Event name type:`, typeof eventName);
            // // console.log(`🔍 [useRealtime] Event name length:`, eventName?.length);
            
            const listener = channel.listen(eventName, callback);
            // // console.log(`🔍 [useRealtime] Listener created:`, listener);
            
            listenersRef.current.set(listenerKey, listener);

            // // console.log(`✅ [useRealtime] Successfully set up listener for: ${listenerKey}`);
            // // console.log(`📊 [useRealtime] Total active listeners: ${listenersRef.current.size}`);

            return listener;
        } catch (error) {
            console.error(`❌ [useRealtime] Error creating listener:`, error);
            console.error(`🔍 [useRealtime] Error details:`, {
                message: error.message,
                stack: error.stack,
                channelName,
                eventName,
                echoInstance: !!echoRef.current
            });
            return null;
        }
    }, []);

    /**
     * Listen to a private channel
     */
    const listenToPrivateChannel = useCallback((channelName, eventName, callback) => {
        if (typeof window === 'undefined') {
            return null;
        }

        if (!echoRef.current) {
            console.warn('Echo not initialized');
            return null;
        }

        const listenerKey = `private:${channelName}:${eventName}`;
        
        // Remove existing listener if any
        if (listenersRef.current.has(listenerKey)) {
            const existingListener = listenersRef.current.get(listenerKey);
            existingListener.stopListening();
        }

        // Add new listener (use direct echo instance instead of async helper)
        const listener = echoRef.current.private(channelName).listen(eventName, callback);
        listenersRef.current.set(listenerKey, listener);

        return listener;
    }, []);

    /**
     * Stop listening to a specific channel/event
     */
    const stopListening = useCallback((channelName, eventName = null) => {
        if (typeof window === 'undefined') {
            return;
        }

        if (eventName) {
            const listenerKey = `${channelName}:${eventName}`;
            const privateListenerKey = `private:${channelName}:${eventName}`;
            
            if (listenersRef.current.has(listenerKey)) {
                listenersRef.current.delete(listenerKey);
            }
            if (listenersRef.current.has(privateListenerKey)) {
                listenersRef.current.delete(privateListenerKey);
            }
        }
        
        leaveChannel(channelName);
    }, []);

    /**
     * Get connection status
     */
    const isConnected = useCallback(() => {
        if (typeof window === 'undefined') {
            return false;
        }
        return echoRef.current?.connector?.pusher?.connection?.state === 'connected';
    }, []);

    /**
     * Get detailed connection info for debugging
     */
    const getConnectionInfo = useCallback(() => {
        if (typeof window === 'undefined') {
            return { available: false, reason: 'Server-side rendering' };
        }
        
        if (!echoRef.current) {
            return { available: false, reason: 'Echo not initialized' };
        }
        
        const state = echoRef.current?.connector?.pusher?.connection?.state;
        return {
            available: !!echoRef.current,
            state: state,
            connected: state === 'connected',
            echo: !!echoRef.current,
            connector: !!echoRef.current?.connector,
            pusher: !!echoRef.current?.connector?.pusher,
            connection: !!echoRef.current?.connector?.pusher?.connection
        };
    }, []);

    return {
        echo: echoRef.current,
        listenToPublicChannel,
        listenToPrivateChannel,
        stopListening,
        isConnected,
        getConnectionInfo,
    };
};

/**
 * Hook specifically for listening to notifications
 */
export const useNotifications = (userId = null) => {
    const { listenToPublicChannel, listenToPrivateChannel, stopListening } = useRealtime();

    /**
     * Listen to general notifications
     */
    const listenToGeneralNotifications = useCallback((callback) => {
        if (typeof window === 'undefined') {
            return null;
        }
        return listenToPublicChannel('notifications', 'notification.sent', callback);
    }, [listenToPublicChannel]);

    /**
     * Listen to user-specific notifications
     */
    const listenToUserNotifications = useCallback((callback) => {
        if (typeof window === 'undefined' || !userId) {
            return null;
        }
        return listenToPrivateChannel(`user.${userId}`, 'notification.sent', callback);
    }, [listenToPrivateChannel, userId]);

    /**
     * Stop listening to notifications
     */
    const stopListeningToNotifications = useCallback(() => {
        if (typeof window === 'undefined') {
            return;
        }
        stopListening('notifications');
        if (userId) {
            stopListening(`user.${userId}`);
        }
    }, [stopListening, userId]);

    return {
        listenToGeneralNotifications,
        listenToUserNotifications,
        stopListeningToNotifications,
    };
};

/**
 * Hook for listening to TikTok account updates
 */
export const useTiktokAccountUpdates = (accountId = null) => {
    const { listenToPrivateChannel, stopListening } = useRealtime();

    /**
     * Listen to TikTok account updates
     */
    const listenToAccountUpdates = useCallback((callback) => {
        if (typeof window === 'undefined' || !accountId) {
            return null;
        }
        return listenToPrivateChannel(`tiktok-accounts.${accountId}`, 'tiktok-account.updated', callback);
    }, [listenToPrivateChannel, accountId]);

    /**
     * Stop listening to account updates
     */
    const stopListeningToAccountUpdates = useCallback(() => {
        if (typeof window === 'undefined' || !accountId) {
            return;
        }
        stopListening(`tiktok-accounts.${accountId}`);
    }, [stopListening, accountId]);

    return {
        listenToAccountUpdates,
        stopListeningToAccountUpdates,
    };
};

/**
 * Hook for listening to transaction updates
 */
export const useTransactionUpdates = (userId = null) => {
    const { listenToPrivateChannel, stopListening } = useRealtime();

    /**
     * Listen to transaction status changes
     */
    const listenToTransactionUpdates = useCallback((callback) => {
        if (typeof window === 'undefined' || !userId) {
            return null;
        }
        return listenToPrivateChannel(`transactions.${userId}`, 'transaction.status-changed', callback);
    }, [listenToPrivateChannel, userId]);

    /**
     * Stop listening to transaction updates
     */
    const stopListeningToTransactionUpdates = useCallback(() => {
        if (typeof window === 'undefined' || !userId) {
            return;
        }
        stopListening(`transactions.${userId}`);
    }, [stopListening, userId]);

    return {
        listenToTransactionUpdates,
        stopListeningToTransactionUpdates,
    };
};

/**
 * Hook for listening to TikTok Account table reload events
 */
export const useTiktokAccountTableReload = () => {
    const { listenToPublicChannel, stopListening, getConnectionInfo } = useRealtime();

    /**
     * Listen to table reload events with retry mechanism
     */
    const listenToTableReload = useCallback((callback) => {
        if (typeof window === 'undefined') {
            console.warn('🚫 [useTiktokAccountTableReload] Window is undefined, cannot listen to events');
            return null;
        }
        
        const channelName = 'tiktok-accounts';
        const eventName = 'tiktok-accounts.reload'; // Event name từ broadcastAs()
        
        // // console.log('🎯 [useTiktokAccountTableReload] Setting up listener');
        // // console.log('🔍 [useTiktokAccountTableReload] Channel name:', channelName);
        // // console.log('🔍 [useTiktokAccountTableReload] Event name:', eventName);
        // // console.log('🔍 [useTiktokAccountTableReload] Callback type:', typeof callback);
        
        // Check if Echo is available before trying to set up listener
        const connectionInfo = getConnectionInfo();
        // // console.log('🔍 [useTiktokAccountTableReload] Connection info:', connectionInfo);
        
        if (!connectionInfo.available) {
            console.error('❌ [useTiktokAccountTableReload] Echo not available:', connectionInfo.reason);
            console.error('💡 [useTiktokAccountTableReload] Will retry when Echo becomes available...');
            
            // Return a retry function instead of null
            return {
                retry: () => listenToTableReload(callback),
                isRetry: true
            };
        }
        
        // Wrap the callback to add logging
        const wrappedCallback = (data) => {
            console.group('📡 [useTiktokAccountTableReload] Raw Socket Event Received');
            // // console.log('🔗 Channel: tiktok-accounts');
            // // console.log('📢 Event: tiktok-accounts.reload');
            // // console.log('📦 Raw Data:', data);
            // // console.log('🕐 Received at:', new Date().toISOString());
            console.groupEnd();
            
            // Call the original callback
            if (callback && typeof callback === 'function') {
                callback(data);
            } else {
                console.warn('⚠️ [useTiktokAccountTableReload] Callback is not a function:', callback);
            }
        };
        
        // Try to set up listener with the standard format first
        // // console.log(`🔄 [useTiktokAccountTableReload] Trying to set up listener...`);
        
        try {
            const listener = listenToPublicChannel(channelName, eventName, wrappedCallback);
            
            if (listener) {
                // // console.log('✅ [useTiktokAccountTableReload] Successfully set up listener');
                // // console.log('🔍 [useTiktokAccountTableReload] Event format used:', eventName);
                // // console.log('🔍 [useTiktokAccountTableReload] Listener object:', listener);
                return listener;
            } else {
                console.error('❌ [useTiktokAccountTableReload] listenToPublicChannel returned null');
                
                // Get detailed connection info for debugging
                const connectionInfo = getConnectionInfo();
                console.error('🔍 [useTiktokAccountTableReload] Connection info:', connectionInfo);
                
                if (!connectionInfo.available) {
                    console.error('💡 [useTiktokAccountTableReload] Suggestion: Echo is not initialized. Check session/auth.');
                } else if (!connectionInfo.connected) {
                    console.error('💡 [useTiktokAccountTableReload] Suggestion: WebSocket not connected. Check Reverb server.');
                } else {
                    console.error('💡 [useTiktokAccountTableReload] Suggestion: Check event name format or Laravel broadcasting config.');
                }
                
                return {
                    retry: () => listenToTableReload(callback),
                    isRetry: true
                };
            }
        } catch (error) {
            console.error('❌ [useTiktokAccountTableReload] Error setting up listener:', error);
            console.error('🔍 [useTiktokAccountTableReload] Error details:', {
                message: error.message,
                stack: error.stack
            });
            
            return {
                retry: () => listenToTableReload(callback),
                isRetry: true
            };
        }
        
        return listener;
    }, [listenToPublicChannel]);

    /**
     * Stop listening to table reload events
     */
    const stopListeningToTableReload = useCallback(() => {
        if (typeof window === 'undefined') {
            return;
        }
        
        // // console.log('🛑 [useTiktokAccountTableReload] Stopping listener for channel: tiktok-accounts');
        stopListening('tiktok-accounts');
        // // console.log('✅ [useTiktokAccountTableReload] Listener stopped');
    }, [stopListening]);

    /**
     * Debug function to check Echo status
     */
    const debugEchoStatus = useCallback(() => {
        console.group('🔍 [useTiktokAccountTableReload] Debug Echo Status');
        
        const connectionInfo = getConnectionInfo();
        // // console.log('Connection Info:', connectionInfo);
        
        if (typeof window !== 'undefined') {
            // // console.log('Window available:', true);
            // // console.log('Echo instance:', window.Echo);
            
            // Try to access Echo directly
            if (window.Echo) {
                // // console.log('Echo connector:', window.Echo.connector);
                // // console.log('Echo pusher:', window.Echo.connector?.pusher);
                // // console.log('Connection state:', window.Echo.connector?.pusher?.connection?.state);
            }
        }
        
        console.groupEnd();
        return connectionInfo;
    }, [getConnectionInfo]);

    return {
        listenToTableReload,
        stopListeningToTableReload,
        debugEchoStatus,
    };
};