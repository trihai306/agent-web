// lib/echo.js
// Dùng cho Next.js (client-side) + Laravel Reverb

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Bắt buộc cho Echo khi dùng chuẩn Pusher/Reverb
if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
  
  // Bật log Pusher để debug (chỉ trong development)
  if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    window.Pusher.logToConsole = true;
  }
}

let echoInstance = null;

/**
 * Khởi tạo Echo (singleton). Tự động lấy authToken từ NextAuth session.
 */
export const initializeEcho = async (manualToken = null) => {
  // Chỉ chạy trên client
  if (typeof window === 'undefined') return null;

  if (echoInstance) return echoInstance;

  // Cấu hình cho Laravel Reverb
  const key = 'xynwukcprjb0jctqndga';
  const wsHost = 'socket.lionsoftware.cloud';
  const port = 443;
  const useTLS = true;
  const enabledTransports = ['wss'];
  const apiUrl = 'https://api.lionsoftware.cloud';
  
  console.log('🔧 [Echo] Config for Laravel Reverb:', { key, wsHost, port, useTLS, enabledTransports, apiUrl });
  
  // Lấy token từ NextAuth session hoặc sử dụng token thủ công
  const authToken = manualToken || await getAuthToken();
  console.log('🔑 [Echo] Auth token:', authToken ? 'Present' : 'Not available');

  try {
    console.log('🚀 [Echo] Creating Echo instance for Laravel Reverb...');
    
    // Cấu hình Echo cho Laravel Reverb
    const echoOptions = {
      broadcaster: 'pusher',
      key,
      wsHost,
      wsPort: port,
      wssPort: port,
      forceTLS: useTLS,
      enabledTransports,
      enableStats: false,
      cluster: 'mt1',
      // Bật lại authentication cho Laravel Reverb
      authEndpoint: `${apiUrl}/api/broadcasting/auth`,
      auth: {
        headers: authToken ? { 
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        } : {},
      },
      // Thêm options cho Laravel Reverb
      disableStats: true,
      encrypted: true,
      // Sử dụng Laravel Reverb protocol
      protocol: '7',
      // Timeout settings
      activityTimeout: 120000,
      pongTimeout: 30000,
      unavailableTimeout: 10000,
    };
    
    console.log('🔧 [Echo] Echo options for Laravel Reverb:', echoOptions);
    
    // Tạo Echo instance
    echoInstance = new Echo(echoOptions);
    
    console.log('✅ [Echo] Echo instance created successfully for Laravel Reverb');
    
    // Kiểm tra xem options có được set đúng không
    const finalPusherOptions = echoInstance.connector?.pusher?.options;
    if (finalPusherOptions) {
      console.log('🔍 [Echo] Final Pusher options verification:', {
        wsHost: finalPusherOptions.wsHost,
        wsPort: finalPusherOptions.wsPort,
        forceTLS: finalPusherOptions.forceTLS,
        enabledTransports: finalPusherOptions.enabledTransports,
        cluster: finalPusherOptions.cluster,
        authEndpoint: finalPusherOptions.authEndpoint,
        auth: finalPusherOptions.auth
      });
    } else {
      console.error('❌ [Echo] Pusher options not found after creation!');
      return null;
    }

    // Gắn vào window để debug và để các nơi khác có thể kiểm tra nhanh
    try {
      window.Echo = echoInstance;
      console.log('🔗 [Echo] Echo attached to window.Echo');
    } catch (_) { /* ignore */ }

    // Debug tiện tra cứu khi local
    if (process.env.NODE_ENV === 'development') {
      try {
        // eslint-disable-next-line no-underscore-dangle
        const clientVersion = Pusher.VERSION || 'unknown';
        const proto = useTLS ? 'wss' : 'ws';
        // Sửa URL để không bị double protocol
        const url = `${proto}://${wsHost.replace(/^wss?:\/\//, '')}:${port}/app/${key}?protocol=7&client=js&version=${clientVersion}&flash=false`;
        // URL này chỉ để bạn nhìn nhanh xem client đang trỏ đi đâu
        // (KHÔNG phải url phải gọi trực tiếp)
        console.log('🌐 [Echo] Connecting to Laravel Reverb at:', url);
        
        // Log thêm về connection strategy
        console.log('🔧 [Echo] Laravel Reverb connection strategy:', {
          wsHost: wsHost.replace(/^wss?:\/\//, ''),
          port,
          useTLS,
          enabledTransports,
          protocol: '7',
          authEndpoint: `${apiUrl}/api/broadcasting/auth`
        });
      } catch (e) {
        console.error('❌ [Echo] Error creating debug URL:', e);
      }

      // Lắng lỗi kết nối
      echoInstance.connector.pusher.connection.bind('error', (err) => {
        console.error('❌ [Echo] Laravel Reverb connection error:', err);
        console.error('❌ [Echo] Error details:', {
          error: err,
          errorType: err.type,
          errorData: err.data,
          errorCode: err.code
        });
        
        // Log thêm về connection state tại thời điểm error
        const connection = echoInstance.connector.pusher.connection;
        console.error('🔍 [Echo] Connection state at error:', {
          state: connection?.state,
          socketId: connection?.socket_id,
          url: connection?.url,
          options: connection?.options
        });
      });

      // Lắng sự kiện kết nối thành công
      echoInstance.connector.pusher.connection.bind('connected', () => {
        console.log('✅ [Echo] Successfully connected to Laravel Reverb WebSocket server');
        console.log('🔍 [Echo] Connection details:', {
          socketId: echoInstance.connector.pusher.connection.socket_id,
          state: echoInstance.connector.pusher.connection.state
        });
      });

      // Lắng sự kiện ngắt kết nối
      echoInstance.connector.pusher.connection.bind('disconnected', () => {
        console.log('🔌 [Echo] Disconnected from Laravel Reverb WebSocket server');
      });

      // Lắng sự kiện connecting
      echoInstance.connector.pusher.connection.bind('connecting', () => {
        console.log('🔄 [Echo] Connecting to Laravel Reverb WebSocket server...');
      });

      // Lắng sự kiện connection_failed
      echoInstance.connector.pusher.connection.bind('connection_failed', () => {
        console.error('❌ [Echo] Connection failed to Laravel Reverb WebSocket server');
        
        // Log chi tiết khi connection failed
        const connection = echoInstance.connector.pusher.connection;
        console.error('🔍 [Echo] Connection failed analysis:');
        console.error('   - Connection state:', connection?.state);
        console.error('   - Error details:', connection?.error);
        console.error('   - Connection URL:', connection?.url);
        console.error('   - Socket ID:', connection?.socket_id);
        
        // Log Pusher options
        const pusher = echoInstance.connector.pusher;
        console.error('🔧 [Echo] Pusher options at failure:');
        console.error('   - Key:', pusher.key);
        console.error('   - Host:', pusher.options?.wsHost);
        console.error('   - Port:', pusher.options?.wsPort);
        console.error('   - Force TLS:', pusher.options?.forceTLS);
        console.error('   - Enabled transports:', pusher.options?.enabledTransports);
        console.error('   - Auth endpoint:', pusher.options?.authEndpoint);
        console.error('   - Auth headers:', pusher.options?.auth?.headers);
        
        // Log network status
        if (typeof navigator !== 'undefined') {
          console.error('🌐 [Echo] Network status at failure:');
          console.error('   - Online:', navigator.onLine);
          console.error('   - Connection type:', navigator.connection?.effectiveType);
        }
      });

      // Lắng sự kiện state_change
      echoInstance.connector.pusher.connection.bind('state_change', (states) => {
        console.log('🔄 [Echo] Connection state changed:', {
          previous: states.previous,
          current: states.current
        });
        
        // Log chi tiết khi failed
        if (states.current === 'failed') {
          console.error('❌ [Echo] Laravel Reverb connection failed! Details:');
          console.error('   - Previous state:', states.previous);
          console.error('   - Current state:', states.current);
          console.error('   - Connection object:', echoInstance.connector.pusher.connection);
          console.error('   - Error details:', echoInstance.connector.pusher.connection.error);
          
          // Log chi tiết hơn về connection
          const connection = echoInstance.connector.pusher.connection;
          console.error('🔍 [Echo] Detailed connection analysis:');
          console.error('   - Connection state:', connection?.state);
          console.error('   - Socket ID:', connection?.socket_id);
          console.error('   - Error type:', connection?.error?.type);
          console.error('   - Error data:', connection?.error?.data);
          console.error('   - Error code:', connection?.error?.code);
          console.error('   - Error message:', connection?.error?.message);
          console.error('   - Connection URL:', connection?.url);
          console.error('   - Connection options:', connection?.options);
          
          // Log Pusher client configuration
          const pusher = echoInstance.connector.pusher;
          console.error('🔧 [Echo] Pusher client configuration:');
          console.error('   - Key:', pusher.key);
          console.error('   - Cluster:', pusher.options?.cluster);
          console.error('   - Host:', pusher.options?.wsHost);
          console.error('   - Port:', pusher.options?.wsPort);
          console.error('   - Force TLS:', pusher.options?.forceTLS);
          console.error('   - Enabled transports:', pusher.options?.enabledTransports);
          console.error('   - Auth endpoint:', pusher.options?.authEndpoint);
          console.error('   - Auth headers:', pusher.options?.auth?.headers);
          
          // Log network status
          if (typeof navigator !== 'undefined') {
            console.error('🌐 [Echo] Network information:');
            console.error('   - Online status:', navigator.onLine);
            console.error('   - Connection type:', navigator.connection?.effectiveType);
            console.error('   - Downlink:', navigator.connection?.downlink);
            console.error('   - RTT:', navigator.connection?.rtt);
          }
          
          // Log browser capabilities
          console.error('🔍 [Echo] Browser capabilities:');
          console.error('   - WebSocket support:', typeof WebSocket !== 'undefined');
          console.error('   - Pusher version:', Pusher.VERSION);
          console.error('   - Echo instance:', !!echoInstance);
          
          // Log timing information
          console.error('⏰ [Echo] Timing information:');
          console.error('   - Current time:', new Date().toISOString());
          console.error('   - Page load time:', performance.timing?.loadEventEnd - performance.timing?.navigationStart);
          
          // Log memory usage (if available)
          if (performance.memory) {
            console.error('💾 [Echo] Memory usage:');
            console.error('   - Used JS heap size:', Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB');
            console.error('   - Total JS heap size:', Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB');
            console.error('   - JS heap size limit:', Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + ' MB');
          }
        }
        
        // Log chi tiết cho tất cả state changes
        console.log('📊 [Echo] State change details:', {
          previous: states.previous,
          current: states.current,
          timestamp: new Date().toISOString(),
          connectionState: echoInstance.connector.pusher.connection?.state,
          socketId: echoInstance.connector.pusher.connection?.socket_id,
          error: echoInstance.connector.pusher.connection?.error
        });
      });

      // Lắng sự kiện message
      echoInstance.connector.pusher.connection.bind('message', (message) => {
        console.log('📨 [Echo] Received message from Laravel Reverb:', message);
      });

      // Thêm log cho tất cả các event khác
      echoInstance.connector.pusher.connection.bind('unavailable', () => {
        console.error('❌ [Echo] Laravel Reverb connection unavailable');
      });

      echoInstance.connector.pusher.connection.bind('retry', () => {
        console.log('🔄 [Echo] Laravel Reverb connection retry');
      });

      // Log connection details sau khi tạo
      setTimeout(() => {
        const connection = echoInstance.connector.pusher.connection;
        console.log('🔍 [Echo] Laravel Reverb connection details after creation:', {
          state: connection?.state,
          socketId: connection?.socket_id,
          error: connection?.error,
          options: connection?.options,
          url: connection?.url
        });
        
        // Log Pusher client details
        console.log('🔍 [Echo] Pusher client details:', {
          key: echoInstance.connector.pusher.key,
          options: echoInstance.connector.pusher.options,
          connection: echoInstance.connector.pusher.connection
        });
        
        // Log chi tiết connection state
        if (connection) {
          console.log('🔍 [Echo] Detailed connection state analysis:');
          console.log('   - State:', connection.state);
          console.log('   - Socket ID:', connection.socket_id);
          console.log('   - Error:', connection.error);
          console.log('   - URL:', connection.url);
          console.log('   - Options:', connection.options);
          
          // Log connection timing
          if (connection.timeline) {
            console.log('⏰ [Echo] Connection timeline:', connection.timeline);
          }
          
          // Log connection error nếu có
          if (connection.error) {
            console.error('❌ [Echo] Connection error details:', {
              type: connection.error.type,
              data: connection.error.data,
              code: connection.error.code,
              message: connection.error.message
            });
          }
        }
        
        // Log Pusher strategy và transport details
        const pusher = echoInstance.connector.pusher;
        if (pusher.strategy) {
          console.log('🔧 [Echo] Pusher strategy details:', {
            strategy: pusher.strategy.constructor.name,
            usingTLS: pusher.strategy.usingTLS,
            transports: Object.keys(pusher.strategy.transports || {}),
            ttl: pusher.strategy.ttl
          });
        }
        
        // Kiểm tra connection state sau 5 giây
        setTimeout(() => {
          const currentConnection = echoInstance.connector.pusher.connection;
          console.log('⏰ [Echo] Laravel Reverb connection state after 5 seconds:', {
            state: currentConnection?.state,
            socketId: currentConnection?.socket_id,
            error: currentConnection?.error,
            timestamp: new Date().toISOString()
          });
          
          if (currentConnection?.state === 'failed') {
            console.error('❌ [Echo] Laravel Reverb connection still failed after 5 seconds!');
            console.error('🔍 [Echo] Final failure analysis:', {
              state: currentConnection.state,
              error: currentConnection.error,
              url: currentConnection.url,
              options: currentConnection.options
            });
            
            // Log thêm về Pusher strategy state
            if (pusher.strategy) {
              console.error('🔧 [Echo] Strategy state at failure:', {
                strategy: pusher.strategy.constructor.name,
                usingTLS: pusher.strategy.usingTLS,
                transports: Object.keys(pusher.strategy.transports || {}),
                ttl: pusher.strategy.ttl
              });
            }
            
            // Summary report
            console.error('📋 [Echo] LARAVEL REVERB DIAGNOSTIC SUMMARY:');
            console.error('   - Configuration:', {
              wsHost,
              port,
              useTLS,
              enabledTransports,
              apiUrl
            });
            console.error('   - Auth token:', authToken ? 'Present' : 'Not available');
            console.error('   - WebSocket URL:', `wss://${wsHost}:${port}/app/${key}`);
            console.error('   - Auth endpoint:', `${apiUrl}/api/broadcasting/auth`);
            console.error('   - Connection state:', currentConnection?.state);
            console.error('   - Error details:', currentConnection?.error);
            console.error('   - Pusher options:', echoInstance.connector?.pusher?.options);
            
            // Recommendations
            console.error('💡 [Echo] LARAVEL REVERB TROUBLESHOOTING RECOMMENDATIONS:');
            console.error('   1. Check if Laravel Reverb server is running on', `${wsHost}:${port}`);
            console.error('   2. Verify broadcasting auth endpoint:', `${apiUrl}/api/broadcasting/auth`);
            console.error('   3. Check Laravel Reverb server logs for connection attempts');
            console.error('   4. Verify firewall/network allows connections to port', port);
            console.error('   5. Check if server accepts WebSocket upgrade requests');
            console.error('   6. Verify Laravel broadcasting configuration in config/broadcasting.php');
            console.error('   7. Check if Laravel Reverb is properly configured in .env');
            console.error('   8. Verify CORS settings for broadcasting auth endpoint');
          }
        }, 5000);
      }, 1000);
    }

    return echoInstance;
  } catch (error) {
    console.error('[Echo] Error initializing Echo for Laravel Reverb:', error);
    echoInstance = null;
    throw error;
  }
};

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

// Auto-initialize Echo when page loads (development only)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Wait for page to be ready
  setTimeout(() => {
    console.log('🚀 [Echo] Auto-initializing Echo...');
    initializeEcho().then(echo => {
      if (echo) {
        console.log('✅ [Echo] Auto-initialization successful');
      } else {
        console.warn('⚠️ [Echo] Auto-initialization failed');
      }
    }).catch(error => {
      console.error('❌ [Echo] Auto-initialization error:', error);
    });
  }, 2000); // Wait 2 seconds for page to load
}
