<?php

namespace App\Modules\Quiz\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class QuizQuestion extends Pivot {

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     *
     * @var type 
     */
    protected $table = 'quiz_questions';

    // use SoftDeletes;
}
