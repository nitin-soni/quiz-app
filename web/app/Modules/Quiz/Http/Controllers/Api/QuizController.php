<?php

namespace App\Modules\Quiz\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Modules\Quiz\Http\Requests\QuizRequest;
use App\Http\Controllers\ApiController;
use App\Modules\Quiz\Models\Quiz;
use App\Modules\Quiz\Models\Question;
use App\Modules\Quiz\Http\Requests\QuizQuestionRequest;

class QuizController extends ApiController {

    /**
     * 
     * @param QuizRequest $request
     * @return type
     */
    public function save(QuizRequest $request) {
        $quiz = new Quiz();
        $quiz->guid = \Ramsey\Uuid\Uuid::uuid4();
        $quiz->name = $request->name;
        $quiz->description = $request->description;
        $quiz->level = $request->level;
        $quiz->type = $request->type;
        $quiz->total_question = $request->total_question;
        $quiz->quiz_time = ($request->quiz_time) ? $request->quiz_time : 0;
        $quiz->status_id = \App\Status::ACTIVE;
        $quiz->start_date = date('Y-m-d', strtotime($request->start_date));
        $quiz->end_date = date('Y-m-d', strtotime($request->end_date));
        $quiz->save();
        $this->apiResponse['message'] = trans('quiz::messages.quiz_success');
        return $this->sendResponse();
    }

    /**
     * 
     * @param Request $request
     * @return type
     */
    public function get(Request $request, $guid = null) {
        if ($guid) {
            $this->apiResponse['data'] = $this->getSingleItem($guid);
        } else {
            $this->apiResponse = $this->getItemList($request);
        }
        return $this->sendResponse();
    }

    /**
     * Get a single Item
     * @param string $guid
     * @return type
     */
    private function getSingleItem(string $guid) {
        $quiz = Quiz::where('guid', $guid)->first();
        $result = [];
        if ($quiz) {
            $result = [
                'guid' => $quiz->guid,
                'name' => $quiz->name,
                'description' => $quiz->description,
                'level' => $quiz->level,
                'type' => $quiz->type,
                'total_question' => $quiz->total_question,
                'quiz_time' => $quiz->quiz_time,
                'start_date' => $quiz->start_date,
                'end_date' => $quiz->end_date,
            ];
        } else {
            $this->apiResponse['message'] = trans('quiz::messages.invalid_guid');
            $this->setResponseCode(422);
        }
        return $result;
    }

    /**
     * Get item list
     * @param Request $request
     * @return type
     */
    private function getItemList(Request $request) {
        $pageNo = $request->get('page', 1);
        $perPage = $request->get('per_page', 20);
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $params = $request->get('search', "");
        $params = (json_decode($params, true));

        $pageOffset = ($pageNo - 1) * $perPage + 1;


        $quiz = new Quiz();
        $quiz = $quiz->orderBy($sortBy, $sortOrder);
        if ($params && is_array($params)) {
            foreach ($params as $field => $val) {
                $quiz = $quiz->where($field, 'like', '%' . $val . '%');
            }
        }
        $list = $quiz->paginate($perPage);
        $data = [];
        foreach ($list as $key => $item) {
            $data[] = [
                's_no' => $pageOffset + $key,
                'guid' => $item->guid,
                'name' => $item->name,
                'description' => $item->description,
                'level' => $item->level,
                'type' => $item->type,
                'total_question' => $item->total_question,
                'quiz_time' => $item->quiz_time,
                'start_date' => $item->start_date,
                'end_date' => $item->end_date,
            ];
        }
        return [
            'data' => $data,
            'total' => $list->total(),
            'total_pages' => $list->lastPage()
        ];
    }

    /**
     * 
     * @param QuestionRequest $request
     * @return type
     */
    public function update(QuizRequest $request) {
        //update quiz
        $quiz = Quiz::where('guid', $request->guid)->first();
        $quiz->name = $request->name;
        $quiz->description = $request->description;
        $quiz->level = $request->level;
        $quiz->type = $request->type;
        $quiz->total_question = $request->total_question;
        $quiz->quiz_time = ($request->quiz_time) ? $request->quiz_time : 0;
        $quiz->start_date = date('Y-m-d', strtotime($request->start_date));
        $quiz->end_date = date('Y-m-d', strtotime($request->end_date));
        $quiz->save();
        //prepare response 
        $this->apiResponse['message'] = trans('quiz::messages.quiz_update');
        return $this->sendResponse();
    }

    /**
     * 
     * @param Request $request
     * @return type
     */
    public function delete(QuizRequest $request) {
        //delete quiz
        $quiz = Quiz::where('guid', $request->guid)->delete();

        //prepare response 
        $this->apiResponse['message'] = trans('quiz::messages.quiz_delete');
        return $this->sendResponse();
    }

    /**
     * Assign/Reassign question to quiz
     * @param QuizQuestionRequest $request
     * @return type
     */
    public function assignQuestions(QuizQuestionRequest $request) {
        $quiz = Quiz::where('guid', $request->quiz_guid)->first();
        if ($request->questions && count($request->questions) > 0) {
            $questions = [];
            foreach ($request->questions as $guid) {
                $question = Question::where('guid', $guid)->first();
                if ($question->id) {
                    $questions[] = $question->id;
                }
            }
            $quiz->question()->sync($questions);
        }
        $this->apiResponse['message'] = trans('quiz::messages.quiz_question_updated');
        return $this->sendResponse();
    }

    /**
     * 
     * @param type $guid
     * @return type
     */
    public function getQuestions($guid) {
        $quiz = Quiz::where('guid', $guid)->first();
        if ($quiz) {
            $questions = [];
            foreach ($quiz->question as $question) {
                $questions[] = [
                    'guid' => $question->guid,
                    'question' => $question->question,
                    'answers' => $question->answers(['id', 'answer'])->getResults()->toArray(),
                ];
            }
            $this->apiResponse['data'] = $questions;
        } else {
            $this->setResponseCode(403);
            $this->apiResponse['message'] = trans('quiz::messages.invalid_guid');
        }
        return $this->sendResponse();
    }

}
