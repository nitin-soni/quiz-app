<?php

namespace App;

use Zizaco\Entrust\Traits\EntrustUserTrait;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
//use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;

class User extends Authenticatable implements AuthenticatableContract {

    use HasApiTokens,
        Notifiable,
        SoftDeletes;
    use EntrustUserTrait {
        EntrustUserTrait::restore insteadof SoftDeletes;
    }

    public function __construct($connecion = NULL) {
        parent::__construct();
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Here we are overriding this function for allowing login with username, email or phone
     * @param string $username
     * @return type
     */
    public function findForPassport($username) {
        return $this->where('email', $username)->orWhere('username', $username)->orWhere('phone_number', $username)->first();
    }

    /**
     * Get the phone record associated with the user.
     */
    public function profile() {
        return $this->hasOne('App\Modules\User\Models\UserProfile', 'user_id');
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token) {
        if ($this->hasRole('admin')) {
            $this->notify(new \App\Modules\Auth\Notifications\ResetPasswordAdminNotification($token));
        } else {
            $this->notify(new \App\Modules\Auth\Notifications\ResetPasswordNotification($token));
        }
    }

}
