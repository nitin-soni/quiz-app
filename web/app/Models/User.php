<?php

namespace App\Models;

//use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

/**
 * Description of User
 *
 * @author Nitin Kumar Soni
 */
class User extends Model implements AuthenticatableContract, AuthorizableContract, CanResetPasswordContract {

    use Authenticatable,
        Authorizable,
        CanResetPassword;

    public function __construct(array $attributes = array()) {
        parent::__construct($attributes);
    }

}
