import { useEffect, useRef, useCallback } from 'react';
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
            return;
        }

        if (session?.accessToken && !echoRef.current) {
            echoRef.current = initializeEcho(session.accessToken);
        }

        return () => {
            if (echoRef.current) {
                leaveAllChannels();
                disconnectEcho();
                echoRef.current = null;
                listenersRef.current.clear();
            }
        };
    }, [session?.accessToken]);

    /**
     * Listen to a public channel
     */
    const listenToPublicChannel = useCallback((channelName, eventName, callback) => {
        if (typeof window === 'undefined') {
            return null;
        }

        if (!echoRef.current) {
            console.warn('Echo not initialized');
            return null;
        }

        const listenerKey = `${channelName}:${eventName}`;
        
        // Remove existing listener if any
        if (listenersRef.current.has(listenerKey)) {
            const existingListener = listenersRef.current.get(listenerKey);
            existingListener.stopListening();
        }

        // Add new listener
        const listener = echoListenToChannel(channelName, eventName, callback);
        listenersRef.current.set(listenerKey, listener);

        return listener;
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

        // Add new listener
        const listener = echoListenToPrivateChannel(channelName, eventName, callback);
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

    return {
        echo: echoRef.current,
        listenToPublicChannel,
        listenToPrivateChannel,
        stopListening,
        isConnected,
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
