<?php

namespace App\Modules\Quiz\Http\Requests;

use App\Http\Requests\MyFormRequest;

/**
 * Description of QuizQuestionRequest
 *
 * @author sonin
 */
class QuizQuestionRequest extends MyFormRequest {

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize() {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'quiz_guid' => 'required|exists:quizzes,guid',
            'questions' => 'required|array'
        ];
    }

}
