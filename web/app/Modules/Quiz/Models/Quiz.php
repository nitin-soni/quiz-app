<?php

namespace App\Modules\Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quiz extends Model {

    use SoftDeletes;

    /**
     * 
     * @return type
     */
    public function question() {
        return $this->belongsToMany('App\Modules\Quiz\Models\Question', 'quiz_questions')
                        ->using('App\Modules\Quiz\Models\QuizQuestion');
    }

}
