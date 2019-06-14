<?php

namespace App\Modules\Quiz\Http\Requests;

use App\Http\Requests\MyFormRequest;
use Illuminate\Validation\Rule;

class QuizRequest extends MyFormRequest {

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
        $result = [];
        $method = strtolower($this->method());
        switch ($method) :
            case 'post':
                $result = [
                    'name' => 'required',
                    'level' => 'required|in:easy,medium,hard',
                    'type' => 'required|in:no_limit,time_based,time_per_question',
                    'total_question' => 'required|numeric',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                    'quiz_time' => 'required_unless:type,no_limit',
                ];
                break;
            case 'delete':
                $result = [
                    'guid' => 'required|exists:quizzes',
                ];
                break;
            case 'put':
            case 'patch':
                $result = [
                    'guid' => 'required|exists:quizzes',
                    'name' => 'required',
                    'level' => 'required|in:easy,medium,hard',
                    'type' => 'required|in:no_limit,time_based,time_per_question',
                    'total_question' => 'required|numeric',
                    'quiz_time' => 'required_unless:type,no_limit',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                ];
                break;
        endswitch;
        return $result;
    }

}
