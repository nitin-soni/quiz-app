<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Role;
use App\Modules\Auth\Models\UserProfile;
use App\Status;

//use Hash;

class UserSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $faker = \Faker\Factory::create();
        $limit = 50;
        echo 'Start seeding ' . "\n\r";
        $status = Status::where('alias', 'active')->first();
        for ($i = 1; $i <= $limit; $i++) {
            ///echo $i."\n\r";
            echo ".";
            $user = new User();
            $user->guid = \Ramsey\Uuid\Uuid::uuid4();
            $user->username = $faker->unique()->userName;
            $user->email = $faker->unique()->email;
            $user->password = Hash::make('123456');
            $user->phone_number = $faker->phoneNumber;
            $user->status_id = $status->id;
            $user->save();

            $userProfile = new UserProfile();
            $userProfile->first_name = $faker->firstName;
            $userProfile->last_name = $faker->lastName;
            $userProfile->registered_from_ip = $faker->ipv4;
            $userProfile->latitude = $faker->latitude;
            $userProfile->longitude = $faker->longitude;
            $userProfile->location = $faker->address;
            $userProfile->dob = $faker->date('Y-m-d', 'now');
            $user->profile()->save($userProfile);

            $role = Role::where('name', '=', 'user')->first();
            $user->attachRole($role);
            
        }
        echo 'Done\n';
    }

}
