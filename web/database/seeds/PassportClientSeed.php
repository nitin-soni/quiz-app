<?php

use Illuminate\Database\Seeder;

class PassportClientSeed extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('oauth_clients')->insert([
            'id' => 1,
            'name' => 'Application Personal Access Client',
            'secret' => 'GdQ8JYsGUdHc9GlsggLhWWadH9AfX71BTknHIWQR',
            'redirect' => config('app.url'),
            'personal_access_client' => 1,
            'password_client' => 0,
            'revoked' => 0,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        DB::table('oauth_clients')->insert([
            'id' => 2,
            'name' => 'Application Password Grant Client',
            'secret' => 'GdQ8JYsGUdHc9GlsggLhWWadH9AfX71BTknHIWQR',
            'redirect' => config('app.url'),
            'personal_access_client' => 0,
            'password_client' => 1,
            'revoked' => 0,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
    }

}
