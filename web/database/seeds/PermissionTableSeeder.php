<?php

use Illuminate\Database\Seeder;
use App\Permission;
use App\Role;

class PermissionTableSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //create permissions and attach persmission to roles
        $permission = [
            [
                'name' => 'role-list',
                'display_name' => 'Display Role Listing',
                'description' => 'See only Listing Of Role'
            ],
            [
                'name' => 'role-create',
                'display_name' => 'Create Role',
                'description' => 'Create New Role'
            ],
            [
                'name' => 'role-edit',
                'display_name' => 'Edit Role',
                'description' => 'Edit Role'
            ],
            [
                'name' => 'role-delete',
                'display_name' => 'Delete Role',
                'description' => 'Delete Role'
            ],
            [
                'name' => 'user-list',
                'display_name' => 'Display user Listing',
                'description' => 'See only Listing Of user'
            ],
            [
                'name' => 'user-create',
                'display_name' => 'Create user',
                'description' => 'Create New user'
            ],
            [
                'name' => 'user-edit',
                'display_name' => 'Edit user',
                'description' => 'Edit user'
            ],
            [
                'name' => 'user-delete',
                'display_name' => 'Delete user',
                'description' => 'Delete user'
            ]
        ];

        $permissions = array();
        foreach ($permission as $key => $value) {
            $perm = Permission::create($value);
            $permissions[] = $perm->id;
        }
        
        
        //now create Roles 
        $super_admin = new Role();
        $super_admin->id = 1;
        $super_admin->name = 'super_admin';
        $super_admin->display_name = 'Super Administrator';
        $super_admin->description = 'Super Administrator of site will have all rights';
        $super_admin->save();
        //attach permission to role
        $super_admin->attachPermissions($permissions);
        
        $sub_admin = new Role();
        $sub_admin->name = 'teacher';
        $sub_admin->display_name = 'Teacher';
        $sub_admin->description = 'An teacher can add question, quiz etc.';
        $sub_admin->save();
        $sub_admin->attachPermissions($permissions);
        
        $user = new Role();
        $user->name = 'user';
        $user->display_name = 'end user';
        $user->description = 'End user of app or student';
        $user->save();
    }

}
