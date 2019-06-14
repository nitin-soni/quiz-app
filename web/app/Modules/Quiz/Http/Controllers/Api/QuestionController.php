<?php

namespace App\Modules\Quiz\Http\Controllers\Api;

use App\Http\Controllers\ApiController;
use App\Modules\Quiz\Http\Requests\QuestionRequest;
use Illuminate\Http\Request;
use App\Modules\Quiz\Models\Question;
use App\Modules\Quiz\Models\Topic;
use App\Modules\Quiz\Models\Answer;

class QuestionController extends ApiController {

    /**
     * 
     * @param QuestionRequest $request
     * @return type
     */
    public function save(QuestionRequest $request) {
        //get unit topic id
        $topic = Topic::where('guid', $request->unit_topic_guid)->first();

        //create and save question
        $question = new Question();
        $question->guid = \Ramsey\Uuid\Uuid::uuid4();
        $question->question = $request->question;
        $question->description = $request->description;
        $question->level = $request->level;
        $question->type = $request->type;
        $question->unit_topic_id = $topic->id;
        $question->save();

        //save answer
        if ($request->answers && count($request->answers) > 0) {
            $answers = [];
            foreach ($request->answers as $answer) {
                $answers[] = [
                    'question_id' => $question->id,
                    'answer' => $answer['answer'],
                    'is_correct' => $answer['is_correct'],
                ];
            }
            Answer::insert($answers);
        }

        $this->apiResponse['message'] = trans('quiz::messages.question_success');
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
        $question = Question::where('guid', $guid)->first();
        $result = [];
        if ($question) {
            $result = [
                'guid' => $question->guid,
                'question' => $question->question,
                'level' => $question->level,
                'type' => $question->type,
                'unit_topic_guid' => $question->topic->guid,
                'unit_topic_name' => $question->topic->name,
                'unit_guid' => $question->topic->unit->guid,
                'unit_name' => $question->topic->unit->name,
                'subject_guid' => $question->topic->unit->subject->guid,
                'subject_name' => $question->topic->unit->subject->name,
                'answers' => $question->answers()->getResults()->toArray(),
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
        $sortBy = $request->get('sort_by', 'question');
        $sortOrder = $request->get('sort_order', 'asc');
        $params = $request->get('search', "");
        $params = (json_decode($params, true));

        $pageOffset = ($pageNo - 1) * $perPage + 1;

        $question = new Question();
        $question = $question->orderBy($sortBy, $sortOrder);
        if ($params && is_array($params)) {
            foreach ($params as $field => $val) {
                if ($field === 'unit_topic_guid') {
                    $question = $question->whereHas('Topic', function($q) use($val) {
                        $q = $q->where('guid', $val);
                    });
                } else {
                    $question = $question->where($field, 'like', '%' . $val . '%');
                }
            }
        }
        $list = $question->paginate($perPage);
        $data = [];
        foreach ($list as $key => $item) {
            //$answers = $item->answers()->getResults()->toArray();
            $data[] = [
                's_no' => $pageOffset + $key,
                'guid' => $item->guid,
                'question' => $item->question,
                'level' => $item->level,
                'type' => $item->type,
                'unit_topic_guid' => $item->topic->guid,
                'unit_topic_name' => $item->topic->name,
                'unit_guid' => $item->topic->unit->guid,
                'unit_name' => $item->topic->unit->name,
                'subject_guid' => $item->topic->unit->subject->guid,
                'subject_name' => $item->topic->unit->subject->name,
                'answers' => $item->answers()->getResults()->toArray(),
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
    public function update(QuestionRequest $request) {
        //get unit topic id
        $topic = Topic::where('guid', $request->unit_topic_guid)->first();

        //create and save question
        $question = Question::where('guid', $request->guid)->first();
        $question->question = $request->question;
        $question->description = $request->description;
        $question->level = $request->level;
        $question->type = $request->type;
        $question->unit_topic_id = $topic->id;
        $question->save();

        //$ids = $question->answers()->delete();
        //save answer
        if ($request->answers && count($request->answers) > 0) {
            $answers = [];
            foreach ($request->answers as $answer) {
                $id = isset($answer['id']) ? $answer['id'] : 0;
                $answer = Answer::updateOrCreate(['id' => $id], [
                            'question_id' => $question->id,
                            'answer' => $answer['answer'],
                            'is_correct' => $answer['is_correct'],
                ]);
                $answers[] = $answer->id;
            }
            Answer::whereNotIn('id', $answers)->where('question_id', $question->id)->delete();
        }


        $this->apiResponse['message'] = trans('quiz::messages.question_update');
        return $this->sendResponse();
    }

    /**
     * 
     * @param Request $request
     * @return type
     */
    public function delete(QuestionRequest $request) {
        Question::where('guid', $request->guid)->delete();
        $this->apiResponse['message'] = trans('quiz::messages.question_delete');
        return $this->sendResponse();
    }

}
