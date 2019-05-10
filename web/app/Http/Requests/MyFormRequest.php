<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;

class MyFormRequest extends FormRequest {

    protected $apiResponse = array(
        'response_code' => 422,
        'message' => '',
    );

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function failedValidation(Validator $validator)
    {
        throw (new ValidationException($validator))
                    ->errorBag($this->errorBag)
                    ->redirectTo($this->getRedirectUrl());
    }

    /**
     * {@inheritdoc}
     * @throws HttpResponseException
     */
    protected function failedAuthorization() {
        throw new HttpResponseException($this->response(
                array('You are not authorized to perform this action.')
        ));
    }

}
