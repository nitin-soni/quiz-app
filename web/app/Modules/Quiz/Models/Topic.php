<?php

namespace App\Modules\Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Topic extends Model
{
    use SoftDeletes;
    
    /**
     * Get the user that owns the profile.
     */
    public function unit() {
        return $this->belongsTo('App\Modules\Quiz\Models\Unit', 'unit_id', 'id');
    }
    
    /**
     * Get the Units for the subject.
     */
    public function quesion()
    {
        return $this->hasMany('App\Modules\Quiz\Models\Question', 'unit_topic_id', 'id');
    }
}
