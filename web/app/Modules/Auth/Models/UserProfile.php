<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model {

    public static function getTableName() {
        return ((new self)->getTable());
    }

    /**
     * Get the user that owns the profile.
     */
    public function user() {
        return $this->belongsTo('App\User', 'user_id', 'id');
    }

    /**
     * Set the user's first name.
     *
     * @param  string  $value
     * @return void
     */
    public function setDobAttribute($value) {
        $this->attributes['dob'] = date('Y-m-d', strtotime($value));
    }

    public function getFullName() {
        return $this->attributes['first_name'] . ' ' . $this->attributes['last_name'];
    }

    /**
     * 
     * @param type $width
     * @param type $height
     * @return type
     */
    public function getProfileImage($width = "", $height = "") {
        $file_name = 'default-male.png';
        if ($this->gender === 'female') {
            $file_name = 'default-female.png';
        }
        $size = (empty($width) || empty($height)) ? '' : '/' . $height . 'x' . $width;
        $file_name = empty($this->profile_image) ? $file_name : $this->profile_image;
        //return $file_name;
        return Media::getFileUrl('profile' . $size, $file_name);
    }

    /**
     * Get the user that owns the profile.
     */
    public function country() {
        return $this->belongsTo('App\Country', 'country_id', 'id');
    }

    /**
     * Get the user that owns the profile.
     */
    public function state() {
        return $this->belongsTo('App\States', 'state_id', 'id');
    }

    /**
     * Get the user that owns the profile.
     */
    public function city() {
        return $this->belongsTo('App\City', 'city_id', 'id');
    }

}
