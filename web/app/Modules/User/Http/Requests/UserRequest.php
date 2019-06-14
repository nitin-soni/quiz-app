<?php

namespace App\Modules\User\Http\Requests;

use App\Http\Requests\MyFormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends MyFormRequest {

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
                    'first_name' => 'required|alpha|max:255',
                    'last_name' => 'required|alpha|max:255',
                    'email' => 'required|email|unique:users,email',
                    'phone_number' => 'required|phone|unique:users,phone_number',
                    //'dob' => 'required|date',
                    'gender' => 'required|in:male,female,other',
                ];
                break;
            case 'delete':
                $result = [
                    'guid' => 'required|exists:users',
                ];
                break;
            case 'put':
            case 'patch':
                $result = [
                    'guid' => 'required|exists:users',
                    'first_name' => 'required|alpha|max:255',
                    'last_name' => 'required|alpha|max:255',
                    'email' => Rule::unique('users')->ignore($this->guid, 'guid'),
                    'phone_number' => [
                        'required',
                        'phone',
                        Rule::unique('users')->ignore($this->guid, 'guid'),
                    ],
                    //'dob' => 'required|date',
                    'gender' => 'required|in:male,female,other',
                    'user_role' => 'required|in:super_admin,teacher,user',
                ];
                break;
        endswitch;
        return $result;
    }

}
