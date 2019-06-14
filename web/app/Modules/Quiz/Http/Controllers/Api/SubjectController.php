<?php

namespace App\Modules\Quiz\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\ApiController;
use App\Modules\Quiz\Http\Requests\SubjectRequest;
use App\Modules\Quiz\Models\Subject;

class SubjectController extends ApiController {

    /**
     * 
     * @param QuestionRequest $request
     * @return type
     */
    public function save(SubjectRequest $request) {
        //save the new subject to database
        $subject = new Subject();
        $subject->guid = \Ramsey\Uuid\Uuid::uuid4();
        $subject->name = $request->name;
        $subject->description = $request->description;
        $subject->save();
        //send response 
        $this->apiResponse['message'] = trans('quiz::messages.subject_success');
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
        $subject = Subject::where('guid', $guid)->first();
        $result = [];
        if ($subject) {
            $result = [
                'guid' => $subject->guid,
                'name' => $subject->name,
                'description' => $subject->description,
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
        //\DB::enableQueryLog();
        $subject = new Subject();
        $subject = $subject->orderBy($sortBy, $sortOrder);
        if ($params && is_array($params)) {
            $subject = $subject->where(function ($query) use($params) {
                foreach ($params as $field => $val) {
                    $query = $query->orWhere($field, 'like', '%' . $val . '%');
                }
            });
        }
        $list = $subject->paginate($perPage);
        //dd(\DB::getQueryLog());

        $data = [];
        foreach ($list as $key => $item) {
            $data[] = [
                's_no' => $pageOffset + $key,
                'guid' => $item->guid,
                'name' => $item->name,
                'description' => $item->description,
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
    public function update(SubjectRequest $request) {
        //create subject object 
        $subject = Subject::where('guid', $request->guid)->first();
        $subject->name = $request->name;
        $subject->description = $request->description;
        $subject->save();
        $subject->touch();

        //prepare response 
        $this->apiResponse['message'] = trans('quiz::messages.subject_update');

        return $this->sendResponse();
    }

    /**
     * 
     * @param Request $request
     * @return type
     */
    public function delete(SubjectRequest $request) {
        //create subject object 
        $subject = Subject::where('guid', $request->guid)->first();

        //delete subject
        $subject->delete();

        //prepare response 
        $this->apiResponse['message'] = trans('quiz::messages.subject_delete');
        return $this->sendResponse();
    }

}
