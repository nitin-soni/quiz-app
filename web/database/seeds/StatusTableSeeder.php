<?php

use Illuminate\Database\Seeder;

class StatusTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('statuses')->insert([
            'name' => 'Active',
            'alias' => 'active',
        ]);
        DB::table('statuses')->insert([
            'name' => 'Blocked',
            'alias' => 'blocked'
        ]);
        DB::table('statuses')->insert([
            'name' => 'Deactive',
            'alias' => 'deactive'
        ]);
        DB::table('statuses')->insert([
            'name' => 'Pending',
            'alias' => 'pending',
        ]);
    }
}
