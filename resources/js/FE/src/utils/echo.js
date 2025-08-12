// lib/echo.js
// Dùng cho Next.js (client-side) + Laravel Reverb

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Bắt buộc cho Echo khi dùng chuẩn Pusher/Reverb
if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
}

let echoInstance = null;

/**
 * Config cố định cho kết nối Reverb
 */
function readConfig() {
  const key = 'xynwukcprjb0jctqndga';
  const wsHost = '127.0.0.1';
  const port = 8080;
  const scheme = 'http';
  const apiUrl = 'http://agent-ai.test';

  const useTLS = scheme === 'https';
  const enabledTransports = useTLS ? ['wss'] : ['ws']; // local http → chỉ ws; https → chỉ wss

  return { key, wsHost, port, useTLS, enabledTransports, apiUrl };
}

/**
 * Lấy auth token từ NextAuth session
 */
async function getAuthToken() {
  if (typeof window === 'undefined') return null;
  
  try {
    const { getSession } = await import('next-auth/react');
    const session = await getSession();
    // console.log('session: ', session);
    return session?.accessToken || null;
  } catch (error) {
    console.warn('[Echo] Could not get auth token:', error);
    return null;
  }
}

/**
 * Khởi tạo Echo (singleton). Tự động lấy authToken từ NextAuth session.
 */
export const initializeEcho = async (manualToken = null) => {
  // Chỉ chạy trên client
  if (typeof window === 'undefined') return null;

  if (echoInstance) return echoInstance;

  const { key, wsHost, port, useTLS, enabledTransports, apiUrl } = readConfig();
  
  // Lấy token từ NextAuth session hoặc sử dụng token thủ công
  const authToken = manualToken || await getAuthToken();

  try {
        echoInstance = new Echo({
            broadcaster: 'pusher',      // Sử dụng 'pusher' cho Laravel Reverb
            key,
            wsHost,
            wsPort: port,
            wssPort: port,
            forceTLS: useTLS,
            enabledTransports,          // tránh thử sai giao thức gây lỗi "Invalid frame header"
            disableStats: true,         // Tắt stats để tránh lỗi
            cluster: 'mt1',             // Thêm cluster cho pusher (bắt buộc)
            authEndpoint: `${apiUrl.replace(/\/$/, '')}/api/broadcasting/auth`,
            auth: {
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
            },
        });

    // Gắn vào window để debug và để các nơi khác có thể kiểm tra nhanh
    try {
      window.Echo = echoInstance;
    } catch (_) { /* ignore */ }

    // Debug tiện tra cứu khi local
    if (process.env.NODE_ENV === 'development') {
      try {
        // eslint-disable-next-line no-underscore-dangle
        const clientVersion = Pusher.VERSION || 'unknown';
        const proto = useTLS ? 'wss' : 'ws';
        const url = `${proto}://${wsHost}:${port}/app/${key}?protocol=7&client=js&version=${clientVersion}&flash=false`;
        // URL này chỉ để bạn nhìn nhanh xem client đang trỏ đi đâu
        // (KHÔNG phải url phải gọi trực tiếp)
        // console.log('[Echo] Connecting to:', url);
      } catch (e) {
        // ignore
      }

      // Lắng lỗi kết nối
      echoInstance.connector.pusher.connection.bind('error', (err) => {
        console.error('[Echo] connection error:', err);
      });

      // Lắng sự kiện kết nối thành công
      echoInstance.connector.pusher.connection.bind('connected', () => {
        console.log('[Echo] Successfully connected to WebSocket server');
      });

      // Lắng sự kiện ngắt kết nối
      echoInstance.connector.pusher.connection.bind('disconnected', () => {
        console.log('[Echo] Disconnected from WebSocket server');
      });
    }

    return echoInstance;
  } catch (error) {
    console.error('[Echo] Error initializing Echo:', error);
    echoInstance = null;
    throw error;
  }
};

/** Lấy instance hiện tại */
export const getEcho = () => echoInstance;

/** Ngắt kết nối và xoá singleton */
export const disconnectEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};

/** Lắng public channel */
export const listenToChannel = async (channelName, eventName, callback) => {
  if (typeof window === 'undefined') return null;
  
  // Tự động khởi tạo Echo nếu chưa có
  if (!echoInstance) {
    await initializeEcho();
  }
  
  if (!echoInstance) return null;
  return echoInstance.channel(channelName).listen(eventName, callback);
};

/** Lắng private channel */
export const listenToPrivateChannel = async (channelName, eventName, callback) => {
  if (typeof window === 'undefined') return null;
  
  // Tự động khởi tạo Echo nếu chưa có
  if (!echoInstance) {
    await initializeEcho();
  }
  
  if (!echoInstance) return null;
  return echoInstance.private(channelName).listen(eventName, callback);
};

/** Rời 1 channel */
export const leaveChannel = (channelName) => {
  if (typeof window === 'undefined' || !echoInstance) return;
  echoInstance.leaveChannel(channelName);
};

/** Rời tất cả channel */
export const leaveAllChannels = () => {
  if (typeof window === 'undefined' || !echoInstance) return;
  const channels = Object.keys(echoInstance.connector.channels || {});
  channels.forEach((name) => echoInstance.leaveChannel(name));
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
