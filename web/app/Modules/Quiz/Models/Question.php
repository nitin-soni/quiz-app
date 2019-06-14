<?php

namespace App\Modules\Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model {

    use SoftDeletes;

    /**
     * 
     * @return type
     */
    public function topic() {
        return $this->belongsTo('App\Modules\Quiz\Models\Topic', 'unit_topic_id', 'id');
    }

    /**
     * 
     * @return type
     */
    public function answers($fields = '*') {
        return $this->hasMany('App\Modules\Quiz\Models\Answer', 'question_id', 'id')
                        ->select($fields);
    }

    /**
     * 
     * @return type
     */
    public function quiz() {
        return $this->belongsToMany('App\Modules\Quiz\Models\Quiz', 'quiz_questions')
                        ->using('App\Modules\Quiz\Models\QuizQuestion');
    }

}
