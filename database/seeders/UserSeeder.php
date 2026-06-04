<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'a@a.com',
        ]);

        User::factory()->create([
            'name' => 'Operator Dishub',
            'email' => 'operator@demo.test',
        ]);

        User::factory()->create([
            'name' => 'Pengawas',
            'email' => 'pengawas@demo.test',
        ]);

        User::factory()->create([
            'name' => 'Kepala Dinas',
            'email' => 'kadinas@demo.test',
        ]);
    }
}
