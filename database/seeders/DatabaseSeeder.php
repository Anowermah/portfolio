<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'anower9135@gmail.com'],
            [
                'name' => 'মো: আনোয়ার হোসাইন',
                'password' => Hash::make('admin123456'),
            ]
        );
    }
}
