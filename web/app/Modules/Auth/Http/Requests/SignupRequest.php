<?php

namespace App\Modules\Auth\Http\Requests;

use App\Http\Requests\MyFormRequest;

class SignupRequest extends MyFormRequest {

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
            'first_name' => 'required|alpha|max:255',
            'last_name' => 'required|alpha|max:255',
            'email' => 'required|email|unique:users,email',
            'phone_number' => 'required|phone|unique:users,phone_number',
            'password' => 'required|min:6|confirmed',
            'password_confirmation' => 'required|min:6',
            'dob' => 'required|date',
            'gender' => 'required|in:male,female,other',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    function messages() {
        return [
            'dob.before' => 'DOB should be before then today',
        ];
    }

}
