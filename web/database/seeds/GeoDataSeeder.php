<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Config;

class GeoDataSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $schema = (empty(Config::get('bp.schemaToSeed'))) ? Config::get('database.connections.mysql.database') : Config::get('bp.schemaToSeed');
        
        //import countries
        exec("mysql -u " . Config::get('database.connections.mysql.username') . " -p" . Config::get('database.connections.mysql.password') . " " . $schema . " < " . __DIR__ . '/sql/countries.sql');

        //import states
        exec("mysql -u " . Config::get('database.connections.mysql.username') . " -p" . Config::get('database.connections.mysql.password') . " " . $schema . " < " . __DIR__ . '/sql/states.sql');

        //import cities
        exec("mysql -u " . Config::get('database.connections.mysql.username') . " -p" . Config::get('database.connections.mysql.password') . " " . $schema . " < " . __DIR__ . '/sql/cities.sql');
    }

}
