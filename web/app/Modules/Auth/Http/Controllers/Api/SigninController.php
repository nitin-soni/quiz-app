<?php

namespace App\Modules\Auth\Http\Controllers\Api;

use App\Http\Controllers\ApiController;
use App\Modules\Auth\Http\Requests\SigninRequest;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use App\Modules\Auth\Models\UserLoginHistory;
use Hash;
use Illuminate\Support\Facades\Auth;
/**
 * Description of SigninController
 *
 * @author sonin
 */
class SigninController extends ApiController {

    use ThrottlesLogins;

    /**
     * 
     * @param SigninRequest $request
     * @return type
     */
    public function index(SigninRequest $request) {
        $user = \App\User::where(function($query) use($request) {
                    $query->orWhere('email', $request->username)
                            ->orWhere('username', $request->username)
                            ->orWhere('phone_number', $request->username);
                })->first();
        if (!empty($user) && $user->status_id == 2) {
            $this->apiResponse['message'] = trans("auth::messages.account_bloacked");
            $this->setResponseCode(422);
        } else if (!empty($user) && Hash::check($request->password, $user->password)) {
            Auth::guard('web')->login($user);
            
            foreach ($user->tokens as $token) {
                $token->revoke();
            }
            
            //get user ip address
            $ipAddress = $request->ip();
            if ($ipAddress == '127.0.0.1') {
                $ipAddress = '103.15.66.178';
            }
            //create user login history
            $userLoginHistory = new UserLoginHistory();
            $userLoginHistory->ip_address = $ipAddress;
            $userLoginHistory->latitude = null; //$location->latitude;
            $userLoginHistory->longitude = null; //$location->longitude;
            $userLoginHistory->user_id = $user->id;
            $userLoginHistory->save();
            
            //prepare response
            $response['token_type'] = 'Bearer';
            $response['access_token'] = $user->createToken('app')->accessToken;
            //$response['refresh_token'] = $user->createToken('app')->refreshToken;
            $response['guid'] = $user->guid;
            $response['username'] = $user->username;
            $response['first_name'] = $user->profile->first_name;
            $response['last_name'] = $user->profile->last_name;
            $response['profile_image'] = $user->profile->profile_image;
            $response['profile_image_url'] = ($user->profile->profile_image === null) ? null : $user->profile->getProfileImage(100, 100);
            $response['gender'] = $user->profile->gender;
            $response['dob'] = $user->profile->dob;
            $response['referral_code'] = $user->referral_code;
            $response['phone_number'] = $user->phone_number;
            $response['email'] = $user->email;
            
            //set response
            $this->apiResponse['message'] = trans("auth::messages.login_success");
            $this->apiResponse['data'] = $response;
        } else {
            $this->apiResponse['message'] = trans("auth::messages.failed");
            $this->setResponseCode(422);
        }
        return $this->sendResponse();
    }

    /**
     * Get the guard to be used during authentication.
     *
     * @return \Illuminate\Contracts\Auth\StatefulGuard
     */
    protected function guard() {
        return Auth::guard();
    }

}
