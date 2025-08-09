<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Tạo hoặc cập nhật user admin@example.com
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'email' => 'admin@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'phone_number' => '1234567890',
                'avatar' => 'https://i.pravatar.cc/150?u=admin@example.com',
                'balance' => 1000000,
            ]
        );

        // Đảm bảo user có login token
        if (!$admin->login_token) {
            $admin->generateLoginToken();
        }

        // Tìm role super-admin
        $superAdminRole = Role::where('name', 'super-admin')->where('guard_name', 'sanctum')->first();
        
        if ($superAdminRole) {
            // Xóa tất cả role cũ và gán role super-admin
            $admin->syncRoles([$superAdminRole]);
            $this->command->info("✅ User {$admin->email} đã được gán role super-admin");
        } else {
            $this->command->warn("⚠️  Role 'super-admin' không tồn tại. Vui lòng chạy DetailedPermissionSeeder trước.");
        }

        $this->command->info("✅ Super Admin user đã được tạo/cập nhật thành công!");
        $this->command->info("📧 Email: {$admin->email}");
        $this->command->info("🔑 Password: password");
        $this->command->info("👑 Roles: " . $admin->getRoleNames()->implode(', '));
    }
}
