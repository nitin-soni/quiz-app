<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Role;
use App\Modules\Auth\Models\UserProfile;
use App\Status;
//use Hash;
class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $status = Status::where('alias', 'active')->first();
        $admin = new User();
        $admin->id = 1;
        $admin->guid = \Ramsey\Uuid\Uuid::uuid4();
        $admin->username = 'admin';
        $admin->email = 'admin@admin.com';
        $admin->password = Hash::make('123456');
        $admin->phone_number = '1234567890';
        $admin->status_id = $status->id;
        $admin->save();
        
        $adminProfile = new UserProfile();
        $adminProfile->id = 1;
        $adminProfile->user_id = 1;
        $adminProfile->first_name = 'Admin';
        $adminProfile->last_name = 'Smith';
        $adminProfile->registered_from_ip = '0.0.0.0';
        $adminProfile->save();
        
        $role = Role::where('name', '=', 'super_admin')->first();
        $admin->attachRole($role);
        
        
    }
}
