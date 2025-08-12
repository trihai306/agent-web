# Test TikTok Account Table Reload System

## 🧪 Cách test hệ thống

### 1. Test từ Command Line

#### Test Private Channel (User cụ thể):
```bash
# Gửi cho user ID 1
php artisan tiktok:reload-table --user-id=1 --message="Test private channel"

# Gửi cho user ID 2
php artisan tiktok:reload-table --user-id=2 --message="Your data updated"
```

#### Test Public Channel (Tất cả users):
```bash
# Gửi cho tất cả users
php artisan tiktok:reload-table --all --message="System maintenance"

# Gửi thông báo chung
php artisan tiktok:reload-table --all --message="Database updated"
```

### 2. Test từ Browser Console

#### Debug Channel Subscription:
```javascript
// Import debug utility
import('@/utils/debugTiktokChannel').then(m => m.debug())

// Hoặc debug trực tiếp
import('@/utils/hooks/useRealtime').then(m => {
  const { debugEchoStatus } = m.useTiktokAccountTableReload(1);
  debugEchoStatus();
});
```

#### Test Manual Subscription:
```javascript
// Test public channel
window.Echo.channel('tiktok-accounts').listen('tiktok-accounts.reload', (data) => {
  console.log('🎉 Public event received:', data);
});

// Test private channel
window.Echo.private('user.1.tiktok-accounts').listen('tiktok-accounts.reload', (data) => {
  console.log('🎉 Private event received:', data);
});
```

### 3. Kiểm tra Logs

#### Backend Logs:
```bash
# Xem Laravel logs
tail -f storage/logs/laravel.log

# Xem Reverb logs (nếu có)
tail -f storage/logs/reverb.log
```

#### Frontend Logs:
- Mở Browser DevTools → Console
- Tìm các log có prefix `[TiktokAccountManagementClient]`
- Tìm các log có prefix `[useTiktokAccountTableReload]`

### 4. Kiểm tra WebSocket Connection

#### Browser DevTools → Network → WS:
- Tìm connection đến Reverb server
- Kiểm tra Messages tab để xem channel subscription
- Tìm các message subscribe/unsubscribe

### 5. Expected Behavior

#### Khi chạy command thành công:
```
🔄 Broadcasting reload event to user: John (ID: 1)...
✅ Event sent to private channel: user.1.tiktok-accounts
📧 Message: Test message
```

#### Khi frontend nhận event:
```
🔒 [TiktokAccountManagementClient] Setting up private channel for user 1
🔄 [TiktokAccountManagementClient] Table reload triggered
```

#### Khi table reload:
- Table data được refresh
- Loading state hiển thị
- Data mới được load từ server

### 6. Troubleshooting

#### Event không nhận được:
1. **Kiểm tra Reverb server:**
   ```bash
   # Kiểm tra Reverb đang chạy
   ps aux | grep reverb
   ```

2. **Kiểm tra Echo connection:**
   ```javascript
   console.log('Echo state:', window.Echo?.connector?.pusher?.connection?.state);
   ```

3. **Kiểm tra Channel subscription:**
   ```javascript
   console.log('Channels:', Object.keys(window.Echo?.connector?.channels || {}));
   ```

4. **Kiểm tra Authentication:**
   ```javascript
   // Kiểm tra session
   console.log('Session:', session);
   console.log('User ID:', session?.user?.id);
   ```

#### Private channel không hoạt động:
1. **Kiểm tra user ID đúng**
2. **Kiểm tra user đã đăng nhập**
3. **Kiểm tra access token**
4. **Kiểm tra broadcasting auth endpoint**

### 7. Test Cases

#### Test Case 1: Public Channel
```bash
php artisan tiktok:reload-table --all --message="Public test"
```
**Expected:** Tất cả users đang online sẽ nhận event

#### Test Case 2: Private Channel
```bash
php artisan tiktok:reload-table --user-id=1 --message="Private test"
```
**Expected:** Chỉ user ID 1 sẽ nhận event

#### Test Case 3: Multiple Users
```bash
php artisan tiktok:reload-table --user-id=1 --message="User 1 only"
php artisan tiktok:reload-table --user-id=2 --message="User 2 only"
```
**Expected:** Mỗi user chỉ nhận event của mình

### 8. Performance Test

#### Load Test:
```bash
# Gửi nhiều events liên tiếp
for i in {1..10}; do
  php artisan tiktok:reload-table --user-id=1 --message="Test $i"
  sleep 1
done
```

#### Concurrent Test:
```bash
# Gửi đồng thời cho nhiều users
php artisan tiktok:reload-table --user-id=1 --message="Concurrent test" &
php artisan tiktok:reload-table --user-id=2 --message="Concurrent test" &
php artisan tiktok:reload-table --user-id=3 --message="Concurrent test" &
wait
```
