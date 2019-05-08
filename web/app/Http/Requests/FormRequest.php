<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest as MasterFormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class FormRequest extends MasterFormRequest {

    protected $apiResponse = array(
        'response_code' => 422,
        'message' => '',
    );

    /**
     * Get the proper failed validation response for the request.
     *
     * @param  array  $errors
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function response(array $errors) {
        $this->apiResponse['message'] = $errors;
        return new JsonResponse($this->apiResponse, 422);
    }

    /**
     * {@inheritdoc}
     */
    protected function formatErrors(Validator $validator) {
        //return $validator->getMessageBag()->toArray();
        return $validator->errors()->all();
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
