# Test Plan: 401 Error Auto Logout

## Vấn đề đã sửa
- Server actions không sử dụng `handleServerActionError` nên lỗi 401 không được chuyển thành `UnauthorizedError`
- `withAuthCheck` không thể bắt được lỗi 401 để redirect đến `/force-logout`

## Các thay đổi đã thực hiện

### 1. Cập nhật Server Actions
Đã cập nhật các server actions sau để sử dụng `handleServerActionError`:

- ✅ `user/updateRole.js`
- ✅ `device/createDevice.js` 
- ✅ `device/updateDevice.js`
- ✅ `device/updateDeviceStatus.js`
- ✅ `device/deleteDevices.js`
- ✅ `tiktok-account/createTiktokAccount.js`
- ✅ `tiktok-account/updateTiktokAccount.js`

### 2. Kiểm tra Route Force Logout
- ✅ Route `/force-logout` đã tồn tại và hoạt động đúng
- ✅ Tự động gọi `signOut()` và redirect về trang đăng nhập

## Cách hoạt động sau khi sửa

### Client-side (không thay đổi)
1. Axios interceptor bắt lỗi 401
2. Tự động gọi `signOut()` 
3. Redirect về trang đăng nhập

### Server-side (đã sửa)
1. API trả về lỗi 401
2. `handleServerActionError` bắt lỗi 401 và throw `UnauthorizedError`
3. `withAuthCheck` bắt `UnauthorizedError` 
4. Redirect đến `/force-logout`
5. `/force-logout` gọi `signOut()` và redirect về trang đăng nhập

## Test Cases

### Test 1: Client-side 401 Error
1. Mở DevTools Network tab
2. Thực hiện action từ UI (ví dụ: cập nhật device)
3. Mock response 401 từ server
4. **Expected**: Tự động logout và redirect về trang đăng nhập

### Test 2: Server-side 401 Error  
1. Thực hiện server action với token hết hạn
2. **Expected**: Redirect đến `/force-logout` rồi về trang đăng nhập

### Test 3: Force Logout Page
1. Truy cập trực tiếp `/force-logout`
2. **Expected**: Hiển thị message "Your session has expired..." và redirect về trang đăng nhập

## Các Server Actions cần cập nhật thêm

Còn khoảng 60+ server actions khác cần cập nhật tương tự. Có thể cập nhật dần theo độ ưu tiên:

**Ưu tiên cao:**
- `auth/*` actions
- `user/*` actions  
- `tiktok-account/*` actions
- `device/*` actions

**Ưu tiên trung bình:**
- `content/*` actions
- `interaction-scenario/*` actions
- `notification/*` actions

**Ưu tiên thấp:**
- `analytic/*` actions
- `help/*` actions
- `file/*` actions

## Lưu ý
- Các server actions đã sử dụng `handleServerActionError` sẽ được skip
- Validation errors (422) vẫn được xử lý riêng biệt trước khi dùng `handleServerActionError`
- Cần test kỹ để đảm bảo không ảnh hưởng đến logic hiện tại
