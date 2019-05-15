<?php

namespace App\Modules\Auth\Http\Controllers\Api;

use App\Http\Controllers\ApiController;
use App\Modules\Auth\Http\Requests\SignupRequest;
use App\Status;
use App\Modules\Auth\Notifications\ConfirmEmail;
use App\Modules\Auth\Notifications\WelcomeNotification;
use DB;
use Hash;

class SignupController extends ApiController {

    public function index(SignupRequest $request) {
        DB::transaction(function() use ($request) {
            //create user
            $user = new \App\User();
            $user->guid = \Ramsey\Uuid\Uuid::uuid4();
            $user->username = $user->guid;
            //$user->username = str_slug($request->first_name . ' ' . $request->last_name, '-');
            $user->email = $request->email;
            $user->phone_number = $request->phone_number;
            $user->password = Hash::make($request->password);
            $user->status_id = Status::PENDING;
            $user->save();

            //now create user profile
            $ipAddress = $request->ip();
            $userProfile = new \App\Modules\Auth\Models\UserProfile();
            $userProfile->first_name = $request->first_name;
            $userProfile->last_name = $request->last_name;
            $userProfile->dob = $request->dob;
            $userProfile->gender = $request->gender;
            $userProfile->dob = $request->dob;
            $userProfile->registered_from_ip = $ipAddress;

            //save profile to user
            $user->profile()->save($userProfile);

            //attach role
            $role = \App\Role::where('name', '=', 'user')->first();
            $user->attachRole($role);

            //Send welcome notification to user
            $user->notify(new ConfirmEmail($user));
            //$user->notify(new WelcomeNotification($user));
        });
        $this->apiResponse['message'] = trans('auth::messages.signup_success');
        return $this->sendResponse();
    }
    
    function test(){
        return $this->sendResponse();
    }
}
