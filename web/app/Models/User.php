<?php

namespace App\Models;

//use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Zizaco\Entrust\Traits\EntrustUserTrait;

/**
 * Description of User
 *
 * @author Nitin Kumar Soni
 */
class User extends Model implements AuthenticatableContract, AuthorizableContract, CanResetPasswordContract {

    use Authenticatable,
        Authorizable,
        CanResetPassword;

    public function __construct(array $attributes = array())
    {
        parent::__construct($attributes);
    }

    /**
     * Here we are overriding this function for allowing login with username, email or phone
     * @param string $username
     * @return type
     */
    public function findForPassport($username)
    {
        return $this->where('email', $username)->orWhere('username', $username)->orWhere('phone_number', $username)->first();
    }

    /**
     * Get the phone record associated with the user.
     */
    public function profile()
    {
        return $this->hasOne('App\Modules\Auth\Models\UserProfile', 'user_id');
    }
    
    /**
     * Get the phone record associated with the user.
     */
    public function status()
    {
        return $this->hasOne('App\Status', 'id', 'status_id');
    }
}
