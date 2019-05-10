<?php

namespace App\Modules\Auth\Http\Controllers\Api;

use App\Http\Controllers\ApiController;
use App\Modules\Auth\Http\Requests\SigninRequest;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use App\Modules\Auth\Models\UserLoginHistory;
use Hash;
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
