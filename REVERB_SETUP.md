# Laravel Reverb Setup Guide

## Cấu hình Laravel Backend

### 1. Cài đặt Laravel Reverb
```bash
composer require laravel/reverb
```

### 2. Cấu hình Environment Variables
Thêm các biến sau vào file `.env`:

```env
# Broadcasting Configuration
BROADCAST_DRIVER=reverb

# Laravel Reverb Configuration
REVERB_APP_ID=app-id
REVERB_APP_KEY=app-key
REVERB_APP_SECRET=app-secret
REVERB_HOST=127.0.0.1
REVERB_PORT=8080
REVERB_SCHEME=http
REVERB_HOSTNAME=localhost
```

### 3. Publish Config Files (nếu cần)
```bash
php artisan vendor:publish --provider="Laravel\Reverb\ReverbServiceProvider"
```

### 4. Chạy Migration (nếu cần)
```bash
php artisan migrate
```

### 5. Khởi động Reverb Server
```bash
php artisan reverb:start
```

## Cấu hình Frontend (Next.js)

### 1. Cài đặt Dependencies
```bash
cd resources/js/FE
npm install laravel-echo pusher-js
```

### 2. Cấu hình Environment Variables
Tạo file `.env.local` trong thư mục frontend:

```env
# Laravel Reverb Configuration
NEXT_PUBLIC_REVERB_APP_KEY=app-key
NEXT_PUBLIC_REVERB_HOST=localhost
NEXT_PUBLIC_REVERB_PORT=8080
NEXT_PUBLIC_REVERB_SCHEME=http

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Test Integration

### 1. Khởi động các service
```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Reverb server
php artisan reverb:start

# Terminal 3: Frontend server
cd resources/js/FE
npm run dev
```

### 2. Truy cập Demo Page
Mở trình duyệt và truy cập: `http://localhost:3000/realtime-demo`

### 3. Test Real-time Features
1. Kiểm tra connection status (phải hiển thị "Connected")
2. Click "Start Listening" để bắt đầu lắng nghe events
3. Sử dụng các nút test để gửi notifications và simulate updates
4. Kiểm tra events log và notification bell

## Các Files Đã Tạo

### Backend Files:
- `config/broadcasting.php` - Cấu hình broadcasting
- `config/reverb.php` - Cấu hình Reverb server
- `routes/channels.php` - Định nghĩa broadcast channels
- `app/Events/NotificationSent.php` - Event cho notifications
- `app/Events/TiktokAccountUpdated.php` - Event cho TikTok account updates
- `app/Events/TransactionStatusChanged.php` - Event cho transaction updates
- `app/Http/Controllers/RealtimeTestController.php` - Controller để test
- `app/Providers/AppServiceProvider.php` - Updated để enable broadcasting

### Frontend Files:
- `src/utils/echo.js` - Echo client configuration
- `src/utils/hooks/useRealtime.js` - Custom hooks cho real-time features
- `src/components/shared/RealtimeNotifications.jsx` - Component hiển thị notifications
- `src/components/shared/RealtimeDemo.jsx` - Demo component
- `src/app/(protected-pages)/realtime-demo/page.jsx` - Demo page
- `REVERB_INTEGRATION.md` - Documentation chi tiết

## API Endpoints

### Test Endpoints:
- `POST /api/realtime/test-notification` - Gửi user notification
- `POST /api/realtime/broadcast-notification` - Gửi broadcast notification
- `POST /api/realtime/simulate-tiktok-update` - Simulate TikTok update
- `POST /api/realtime/simulate-transaction-status` - Simulate transaction update
- `GET /api/realtime/connection-info` - Lấy thông tin connection

### Broadcasting Auth:
- `POST /api/broadcasting/auth` - Authentication cho private channels

## Troubleshooting

### Lỗi Connection
1. Kiểm tra Reverb server đang chạy
2. Kiểm tra environment variables
3. Kiểm tra CORS settings
4. Kiểm tra firewall/port settings

### Lỗi Authentication
1. Kiểm tra user đã login
2. Kiểm tra token hợp lệ
3. Kiểm tra broadcasting auth endpoint

### Events không nhận được
1. Kiểm tra channel và event name
2. Kiểm tra permissions cho private channels
3. Kiểm tra browser console và network tab

## Sử dụng trong Production

### 1. Cấu hình SSL/TLS
```env
REVERB_SCHEME=https
```

### 2. Cấu hình Scaling với Redis
```env
REVERB_SCALING_ENABLED=true
REDIS_HOST=your-redis-host
REDIS_PORT=6379
```

### 3. Cấu hình Load Balancer
Đảm bảo sticky sessions hoặc sử dụng Redis scaling

## Tích hợp vào Components Hiện tại

### 1. Thêm RealtimeNotifications vào Layout
```jsx
import RealtimeNotifications from '@/components/shared/RealtimeNotifications';

// Trong layout component
<RealtimeNotifications />
```

### 2. Sử dụng hooks trong components
```jsx
import { useNotifications } from '@/utils/hooks/useRealtime';

const MyComponent = () => {
    const { listenToUserNotifications } = useNotifications(userId);
    
    useEffect(() => {
        listenToUserNotifications((notification) => {
            // Handle notification
        });
    }, []);
};
```

## Kết luận

Tích hợp Laravel Reverb đã hoàn thành với:
- ✅ Backend configuration và events
- ✅ Frontend Echo client và hooks
- ✅ Demo components và page
- ✅ Documentation chi tiết
- ✅ Test endpoints

Bạn có thể bắt đầu sử dụng real-time features ngay bây giờ!
