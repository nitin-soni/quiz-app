<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

/**
 * Description of ApiController
 *
 * @author nitins
 */
class ApiController extends BaseController {

    use AuthorizesRequests,
        DispatchesJobs,
        ValidatesRequests;

    /**
     * API response code
     * @var int
     */
    private $responseCode = 200;
    protected $apiResponse = array(
        'response_code' => 200,
        'message' => '',
    );

    /**
     * 
     * @return type
     */
    protected function sendResponse() {
        $this->apiResponse['response_code'] = $this->responseCode;
        return response()->json($this->apiResponse, $this->responseCode);
    }

    /**
     * 
     * @return type
     */
    function getResponseCode() {
        return $this->responseCode;
    }

    /**
     * 
     * @param type $responseCode
     */
    function setResponseCode($responseCode) {
        $this->responseCode = $responseCode;
    }

}
