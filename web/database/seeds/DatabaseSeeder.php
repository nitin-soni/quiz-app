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
        $this->call(GeoDataSeeder::class);
        $this->call(App\Modules\Media\Database\Seeds\MediaSectionSeeder::class);
        $this->call(App\Modules\Media\Database\Seeds\MediaTypeSeeder::class);
        $this->call(App\Modules\Media\Database\Seeds\MediaExtenstionSeeder::class);
        $this->call(PassportClientSeed::class);

        if (config('app.debug')) {
            $this->call(UserSeeder::class);
            //$this->call(CategoryTableSeeder::class);
        }
    }

}
