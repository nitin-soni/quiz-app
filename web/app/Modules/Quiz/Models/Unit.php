<?php

namespace App\Modules\Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model {

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'description', 'subject_id'];

    /**
     * Get the user that owns the profile.
     */
    public function subject() {
        return $this->belongsTo('App\Modules\Quiz\Models\Subject', 'subject_id', 'id');
    }
    
    /**
     * Get the Units for the subject.
     */
    public function topic()
    {
        return $this->hasMany('App\Modules\Quiz\Models\Topic', 'unit_id', 'id');
    }
}
