<?php

namespace App\Modules\Quiz\Http\Requests;

use App\Http\Requests\MyFormRequest;

/**
 * Description of QuestionRequest
 *
 * @author sonin
 */
class QuestionRequest extends MyFormRequest {

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
                    'question' => 'required',
                    'unit_topic_guid' => 'required|exists:topics,guid',
                    'level' => 'required|in:easy,medium,hard',
                    'type' => 'required|in:single_choice,multiple_choice',
                ];
                break;
            case 'delete':
                $result = [
                    'guid' => 'required|exists:questions',
                ];
                break;
            case 'put':
            case 'patch':
                $result = [
                    'guid' => 'required|exists:questions',
                    'question' => 'required',
                    'unit_topic_guid' => 'required|exists:topics,guid',
                    'level' => 'required|in:easy,medium,hard',
                    'type' => 'required|in:single_choice,multiple_choice',
                ];
                break;
        endswitch;
        return $result;
    }

}
