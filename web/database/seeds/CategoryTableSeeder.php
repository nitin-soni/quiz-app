<?php

use Illuminate\Database\Seeder;
use App\Modules\Category\Models\Category;

class CategoryTableSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create();
        $limit = 50;
        echo 'Start seeding ' . "\n\r";
        for ($i = 1; $i <= $limit; $i++)
        {
            ///echo $i."\n\r";
            echo ".";
            $category = new Category();
            $category->guid = \Ramsey\Uuid\Uuid::uuid4();
            $category->name = $faker->jobTitle;
            $category->description = $faker->realText($maxNbChars = 200, $indexSize = 2);
            $category->entity_type = 'page';
            $category->save();
        }
        echo "\n\r" . 'Done';
    }

}
