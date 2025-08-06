<?php

namespace Database\Seeders;

use App\Models\AccountTask;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccountTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AccountTask::factory()->count(50)->create();
    }
}
