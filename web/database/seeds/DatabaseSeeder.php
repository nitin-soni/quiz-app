<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {

    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run() {
        $this->call(StatusTableSeeder::class);
        $this->call(PermissionTableSeeder::class);
        $this->call(CountriesTableSeeder::class);
        $this->call(StatesTableSeeder::class);
        $this->call(CitiesTableSeeder::class);
        //$this->call(GeoDataSeeder::class);
        $this->call(UsersTableSeeder::class);
        if (config('app.debug')) {
            $this->call(UserSeeder::class);
            //$this->call(CategoryTableSeeder::class);
        }
    }

}
