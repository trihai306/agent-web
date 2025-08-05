<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        Permission::create(['name' => 'create users']);
        Permission::create(['name' => 'read users']);
        Permission::create(['name' => 'update users']);
        Permission::create(['name' => 'delete users']);

        Permission::create(['name' => 'create roles']);
        Permission::create(['name' => 'read roles']);
        Permission::create(['name' => 'update roles']);
        Permission::create(['name' => 'delete roles']);

        Permission::create(['name' => 'create permissions']);
        Permission::create(['name' => 'read permissions']);

        // create roles and assign created permissions
        $userRole = Role::create(['name' => 'user']);
        
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // assign roles to existing users
        $adminUser = User::where('email', 'admin@example.com')->first();
        if ($adminUser) {
            $adminUser->assignRole($adminRole);
        }

        $users = User::where('email', '!=', 'admin@example.com')->get();
        foreach ($users as $user) {
            $user->assignRole($userRole);
        }
    }
}
