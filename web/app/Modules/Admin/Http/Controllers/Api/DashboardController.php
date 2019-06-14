<?php

namespace App\Modules\Admin\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\ApiController;
use App\User;

class DashboardController extends ApiController {

    public function statics(Request $request) {
        $result = [
            'total_users' => User::count(),
            'total_questions' => \App\Modules\Quiz\Models\Question::count(),
            'total_quizes' => \App\Modules\Quiz\Models\Quiz::count(),
            'total_request' => 12,
        ];
        $this->apiResponse['data'] = $result;
        return $this->sendResponse();
    }

}
