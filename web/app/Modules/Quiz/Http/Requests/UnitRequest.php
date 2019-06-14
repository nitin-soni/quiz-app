<?php

namespace App\Modules\Quiz\Http\Requests;

use App\Http\Requests\MyFormRequest;

class UnitRequest extends MyFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $result = [];
        $method = strtolower($this->method());
        switch ($method) :
            case 'post':
                $result = [
                    'name' => 'required|max:255',
                    'subject_guid' => 'required|exists:subjects,guid',
                ];
                break;
            case 'delete':
                $result = [
                    'guid' => 'required|exists:units',
                ];
                break;
            case 'put':
            case 'patch':
                $result = [
                    'guid' => 'required|exists:units',
                    'name' => 'required|max:255',
                    'subject_guid' => 'required|exists:subjects,guid',
                ];
                break;
        endswitch;
        return $result;
    }
}
