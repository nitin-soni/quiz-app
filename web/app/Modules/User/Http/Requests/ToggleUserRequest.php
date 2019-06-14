<?php

namespace App\Modules\User\Http\Requests;

use App\Http\Requests\MyFormRequest;

class ToggleUserRequest extends MyFormRequest {
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
            'guid' => 'required|exists:users',
        ];
    }
}
