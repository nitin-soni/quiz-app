<?php

namespace App\Modules\Quiz\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    public $timestamps = false;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['question_id', 'answer', 'is_correct'];
    
    /**
     * Get the user that owns the profile.
     */
    public function question() {
        return $this->belongsTo('App\Modules\Quiz\Models\Question', 'question_id', 'id');
    }
}
