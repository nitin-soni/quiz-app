<?php

namespace App\Modules\Quiz\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Modules\Quiz\Http\Requests\TopicRequest;
use App\Http\Controllers\ApiController;
use App\Modules\Quiz\Models\Unit;
use App\Modules\Quiz\Models\Topic;

class TopicController extends ApiController {
    /**
     * 
     * @param QuestionRequest $request
     * @return type
     */
    public function save(TopicRequest $request) {
        //create and save new topic
        $topic = new Topic();
        $topic->guid = \Ramsey\Uuid\Uuid::uuid4();
        $topic->name = $request->name;
        $topic->description = $request->description;

        $unit = Unit::where('guid', $request->unit_guid)->first();
        if ($unit) {
            $unit->topic()->save($topic);
            $this->apiResponse['message'] = trans('quiz::messages.topic_success');
        } else {
            $this->apiResponse['message'] = trans('quiz::messages.invalid_guid');
        }
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
        $topic = Topic::where('guid', $guid)->first();
        $result = [];
        if ($unit) {
            $result = [
                'guid' => $topic->guid,
                'name' => $topic->name,
                'description' => $topic->description,
                'subject_name' => $topic->subject->name,
                'subject_guid' => $topic->subject->guid,
                'unit_guid' => $topic->unit->guid,
                'unit_guid' => $topic->unit->guid,
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
        
        $topic = new Topic();
        $topic = $topic->orderBy($sortBy, $sortOrder);
        $list = $topic->paginate($perPage);
        
        $data = [];
        foreach ($list as $key => $item) {
            $data[] = [
                's_no' => $pageOffset + $key,
                'guid' => $item->guid,
                'name' => $item->name,
                'description' => $item->description,
                'unit_guid' => $item->unit->guid,
                'unit_name' => $item->unit->name,
                'subject_name' => $item->unit->subject->name,
                'subject_guid' => $item->unit->subject->guid,
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
    public function update(TopicRequest $request) {
        //create and save new topic
        $topic = Topic::where('guid', $request->guid)->first();
        $topic->name = $request->name;
        $topic->description = $request->description;

        $unit = Unit::where('guid', $request->unit_guid)->first();
        if ($unit) {
            $unit->topic()->save($topic);
            $topic->touch();
            $this->apiResponse['message'] = trans('quiz::messages.topic_update');
        } else {
            $this->apiResponse['message'] = trans('quiz::messages.invalid_guid');
        }
        return $this->sendResponse();
    }

    /**
     * 
     * @param Request $request
     * @return type
     */
    public function delete(TopicRequest $request) {
        $topic = Topic::where('guid', $request->guid)->first();
        $topic->delete();
        $this->apiResponse['message'] = trans('quiz::messages.topic_delete');
        return $this->sendResponse();
    }
}
