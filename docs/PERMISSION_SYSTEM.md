# Hệ thống Phân quyền API (Permission System)

## Tổng quan

Dự án đã được cải thiện với hệ thống phân quyền chi tiết sử dụng **Spatie Permission** package. Hệ thống này cho phép kiểm soát truy cập API một cách linh hoạt và bảo mật.

## Các thành phần chính

### 1. Middleware

#### CheckPermission
- **File**: `app/Http/Middleware/CheckPermission.php`
- **Cách sử dụng**: `->middleware('permission:permission_name')`
- **Mục đích**: Kiểm tra quyền cụ thể của user

#### CheckRole
- **File**: `app/Http/Middleware/CheckRole.php`
- **Cách sử dụng**: `->middleware('role:role_name')`
- **Mục đích**: Kiểm tra vai trò của user

### 2. Helper Class

#### PermissionHelper
- **File**: `app/Helpers/PermissionHelper.php`
- **Các method chính**:
  - `hasPermission(string $permission)`: Kiểm tra quyền
  - `hasRole(string $role)`: Kiểm tra vai trò
  - `getUserPermissions()`: Lấy danh sách quyền của user
  - `isAdmin()`: Kiểm tra user có phải admin
  - `getFormattedUserPermissions()`: Lấy quyền đã format cho API

### 3. Roles và Permissions

#### Roles mặc định:
- **super-admin**: Toàn quyền
- **admin**: Quyền quản trị (hầu hết permissions)
- **manager**: Quyền quản lý (một số permissions)
- **user**: Quyền cơ bản (chỉ dữ liệu của mình)

#### Nhóm Permissions:

##### User Management
- `users.view` - Xem danh sách users
- `users.create` - Tạo user mới
- `users.edit` - Chỉnh sửa user
- `users.delete` - Xóa user
- `users.assign-roles` - Gán role cho user
- `users.bulk-operations` - Thao tác hàng loạt

##### Transaction Management
- `transactions.view` - Xem tất cả giao dịch
- `transactions.view-own` - Xem giao dịch của mình
- `transactions.approve` - Duyệt giao dịch
- `transactions.reject` - Từ chối giao dịch
- `transactions.deposit` - Nạp tiền
- `transactions.withdrawal` - Rút tiền
- `transactions.bulk-operations` - Thao tác hàng loạt

##### TikTok Account Management
- `tiktok-accounts.view` - Xem tài khoản TikTok
- `tiktok-accounts.create` - Tạo tài khoản TikTok
- `tiktok-accounts.edit` - Chỉnh sửa tài khoản
- `tiktok-accounts.delete` - Xóa tài khoản
- `tiktok-accounts.import` - Import tài khoản
- `tiktok-accounts.bulk-operations` - Thao tác hàng loạt

##### Content Management
- `interaction-scenarios.*` - Quản lý kịch bản tương tác
- `scenario-scripts.*` - Quản lý script kịch bản
- `account-tasks.*` - Quản lý nhiệm vụ tài khoản

##### System Management
- `devices.*` - Quản lý thiết bị
- `notifications.*` - Quản lý thông báo
- `settings.*` - Quản lý cài đặt

##### Analytics & Reports
- `analytics.view` - Xem báo cáo
- `analytics.transactions` - Báo cáo giao dịch
- `ai-spending.*` - Lịch sử sử dụng AI

## Cách sử dụng

### 1. Trong Routes

```php
// Kiểm tra permission cụ thể
Route::get('/users', [UserController::class, 'index'])
    ->middleware('permission:users.view');

// Kiểm tra role
Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])
    ->middleware('role:admin');

// Kết hợp nhiều middleware
Route::post('/users', [UserController::class, 'store'])
    ->middleware(['permission:users.create', 'role:admin']);
```

### 2. Trong Controllers

```php
// Kiểm tra permission
if (!auth()->user()->can('users.create')) {
    return response()->json(['message' => 'Forbidden'], 403);
}

// Sử dụng PermissionHelper
use App\Helpers\PermissionHelper;

if (!PermissionHelper::hasPermission('users.edit')) {
    return response()->json(['message' => 'Forbidden'], 403);
}

// Kiểm tra admin
if (PermissionHelper::isAdmin()) {
    // Logic cho admin
}
```

### 3. Trong Blade Templates (nếu có)

```php
@can('users.view')
    <a href="/users">Quản lý Users</a>
@endcan

@role('admin')
    <div class="admin-panel">...</div>
@endrole
```

## API Endpoints mới

### Lấy thông tin permissions của user hiện tại
```
GET /api/profile/permissions
```

**Response:**
```json
{
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe"
    },
    "permissions": {
        "roles": ["admin"],
        "permissions": ["users.view", "users.create", ...],
        "permission_groups": {
            "User Management": ["users.view", "users.create"],
            "Transaction Management": ["transactions.view", ...]
        }
    }
}
```

## Quản lý Permissions

### Tạo Permission mới
```php
use Spatie\Permission\Models\Permission;

Permission::create(['name' => 'new-feature.access']);
```

### Gán Permission cho Role
```php
use Spatie\Permission\Models\Role;

$role = Role::findByName('admin');
$role->givePermissionTo('new-feature.access');
```

### Gán Role cho User
```php
$user = User::find(1);
$user->assignRole('admin');

// Hoặc gán permission trực tiếp
$user->givePermissionTo('specific.permission');
```

## Testing

### Test Permission Middleware
```php
// Test với user có quyền
$user = User::factory()->create();
$user->givePermissionTo('users.view');

$response = $this->actingAs($user)
    ->get('/api/users');

$response->assertStatus(200);

// Test với user không có quyền
$userWithoutPermission = User::factory()->create();

$response = $this->actingAs($userWithoutPermission)
    ->get('/api/users');

$response->assertStatus(403);
```

## Lưu ý quan trọng

1. **Cache**: Spatie Permission sử dụng cache. Sau khi thay đổi permissions, chạy:
   ```bash
   php artisan permission:cache-reset
   ```

2. **Seeding**: Chạy seeder để tạo permissions mặc định:
   ```bash
   php artisan db:seed --class=DetailedPermissionSeeder
   ```

3. **Guard**: Mặc định sử dụng guard 'web'. Nếu cần guard khác, cấu hình trong `config/permission.php`

4. **Performance**: Với nhiều permissions, cân nhắc sử dụng eager loading:
   ```php
   $users = User::with('roles.permissions')->get();
   ```

## Troubleshooting

### Lỗi thường gặp:

1. **"Permission does not exist"**
   - Chạy seeder hoặc tạo permission thủ công

2. **"User does not have permission"**
   - Kiểm tra user đã được gán role/permission chưa
   - Xóa cache: `php artisan permission:cache-reset`

3. **Middleware không hoạt động**
   - Kiểm tra middleware đã được đăng ký trong `bootstrap/app.php`
   - Đảm bảo route được bảo vệ bởi `auth:sanctum`

## Mở rộng

Để thêm permissions mới cho module mới:

1. Thêm permissions vào `DetailedPermissionSeeder.php`
2. Cập nhật `PermissionHelper::getPermissionGroups()`
3. Thêm middleware vào routes tương ứng
4. Chạy seeder để cập nhật database

Hệ thống permission này cung cấp nền tảng vững chắc cho việc bảo mật API và có thể mở rộng dễ dàng theo nhu cầu dự án.
