# Cấu hình Proxy cho Next.js + Laravel

## Vấn đề hiện tại
Bạn đang gặp lỗi RSC (React Server Components) payload được trả về thay vì HTML. Điều này xảy ra khi:
- Laravel can thiệp vào Next.js requests
- Headers RSC bị xử lý sai
- Proxy configuration không đúng

## Giải pháp đã áp dụng

### 1. CORS Configuration (✅ Hoàn thành)
- Thêm Next.js headers vào allowed_headers
- Cập nhật allowed_origins cho development và production

### 2. .htaccess Configuration (✅ Hoàn thành)  
- Thêm rules để handle Next.js RSC headers
- Preserve headers khi forward requests

### 3. Laravel Middleware (✅ Hoàn thành)
- Tạo HandleNextJsRequests middleware
- Detect và reject RSC requests từ Laravel
- Thêm proper CORS headers

### 4. Routes Configuration (✅ Hoàn thành)
- Cập nhật web.php để tránh conflict
- Thêm health check endpoint
- Fallback route cho unknown requests

## Cấu hình Development Environment

### Option 1: Chạy riêng biệt (Khuyến nghị)
```bash
# Terminal 1: Laravel API
cd /path/to/laravel
php artisan serve --host=127.0.0.1 --port=8000

# Terminal 2: Next.js Frontend  
cd resources/js/FE
npm run dev
```

### Option 2: Nginx Proxy (Production)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Next.js frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Preserve Next.js headers
        proxy_set_header RSC $http_rsc;
        proxy_set_header Next-Url $http_next_url;
        proxy_set_header Next-Router-State-Tree $http_next_router_state_tree;
        proxy_set_header Next-Pathname-Index $http_next_pathname_index;
        proxy_set_header Next-Action $http_next_action;
        
        proxy_cache_bypass $http_upgrade;
    }

    # Laravel API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Laravel health check
    location /health {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
    }
}
```

### Option 3: Apache Virtual Host (Laragon)
```apache
<VirtualHost *:80>
    ServerName agent-ai.test
    DocumentRoot "C:/laragon/www/agent-ai/public"
    
    # Laravel routes
    <Location "/api">
        ProxyPass "http://127.0.0.1:8000/api"
        ProxyPassReverse "http://127.0.0.1:8000/api"
        ProxyPreserveHost On
    </Location>
    
    <Location "/health">
        ProxyPass "http://127.0.0.1:8000/health"
        ProxyPassReverse "http://127.0.0.1:8000/health"
    </Location>
    
    # Next.js frontend (fallback)
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
    ProxyPreserveHost On
    
    # Preserve Next.js headers
    ProxyPassReverse / http://127.0.0.1:3000/
    RequestHeader set RSC %{HTTP_RSC}e env=HTTP_RSC
    RequestHeader set Next-Url %{HTTP_NEXT_URL}e env=HTTP_NEXT_URL
</VirtualHost>
```

## Testing

### 1. Test Laravel API
```bash
curl -X GET http://127.0.0.1:8000/health
# Expected: {"status":"ok","service":"Laravel API","timestamp":"..."}

curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 2. Test Next.js Frontend
```bash
curl -X GET http://127.0.0.1:3000
# Expected: HTML content (not RSC payload)

curl -X GET http://127.0.0.1:3000/sign-in
# Expected: HTML content (not RSC payload)
```

### 3. Test RSC Headers (Should be rejected by Laravel)
```bash
curl -X GET http://127.0.0.1:8000/sign-in \
  -H "RSC: 1" \
  -H "Next-Router-State-Tree: ..."
# Expected: {"error":"RSC requests should be handled by Next.js server"}
```

## Troubleshooting

### Nếu vẫn thấy RSC payload:
1. Kiểm tra bạn đang truy cập đúng port (3000 cho Next.js, 8000 cho Laravel)
2. Xóa cache browser và hard refresh (Ctrl+Shift+R)
3. Kiểm tra Network tab trong DevTools xem request đi đâu
4. Đảm bảo Next.js đang chạy: `npm run dev`

### Nếu CORS errors:
1. Kiểm tra origin trong config/cors.php
2. Restart Laravel server sau khi thay đổi config
3. Kiểm tra middleware đã được đăng ký chưa

### Nếu API calls fail:
1. Kiểm tra API_BASE_URL trong app.config.js
2. Đảm bảo Laravel API đang chạy trên port 8000
3. Test API endpoints trực tiếp với curl/Postman
