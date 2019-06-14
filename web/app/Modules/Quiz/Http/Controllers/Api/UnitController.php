<?php

namespace App\Modules\Quiz\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Modules\Quiz\Http\Requests\UnitRequest;
use App\Http\Controllers\ApiController;
use App\Modules\Quiz\Models\Unit;
use App\Modules\Quiz\Models\Subject;

class UnitController extends ApiController {

    /**
     * 
     * @param QuestionRequest $request
     * @return type
     */
    public function save(UnitRequest $request) {
        //create and save new unit
        $unit = new Unit();
        $unit->guid = \Ramsey\Uuid\Uuid::uuid4();
        $unit->name = $request->name;
        $unit->description = $request->description;

        $subject = Subject::where('guid', $request->subject_guid)->first();
        if ($subject) {
            $subject->units()->save($unit);
            $this->apiResponse['message'] = trans('quiz::messages.unit_success');
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
        $unit = Unit::where('guid', $guid)->first();
        $result = [];
        if ($unit) {
            $result = [
                'guid' => $unit->guid,
                'name' => $unit->name,
                'description' => $unit->description,
                'subject_name' => $unit->subject->name,
                'subject_guid' => $unit->subject->guid,
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
//        \DB::enableQueryLog();
        $unit = new Unit();
        $unit = $unit->orderBy($sortBy, $sortOrder);
        if ($params && is_array($params)) {
            $unit = $unit->where(function ($query) use($params, $unit) {
                foreach ($params as $field => $val) {
                    if ($field === 'subject_name') {
                        $unit = $unit->whereHas('Subject', function($q) use($val) {
                            $q = $q->where('name', 'like', '%' . $val . '%');
                        });
                    } else if ($field === 'subject_guid') {
                        $unit = $unit->whereHas('Subject', function($q) use($val) {
                            $q = $q->where('guid', $val);
                        });
                    } else {
                        $query = $query->orWhere($field, 'like', '%' . $val . '%');
                    }
                }
            });
        }
        $list = $unit->paginate($perPage);
//        dd(\DB::getQueryLog());

        $data = [];
        foreach ($list as $key => $item) {
            $data[] = [
                's_no' => $pageOffset + $key,
                'guid' => $item->guid,
                'name' => $item->name,
                'description' => $item->description,
                'subject_name' => $item->subject->name,
                'subject_guid' => $item->subject->guid,
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
    public function update(UnitRequest $request) {
        //create and save new unit
        $unit = Unit::where('guid', $request->guid)->first();
        $unit->name = $request->name;
        $unit->description = $request->description;

        $subject = Subject::where('guid', $request->subject_guid)->first();
        if ($subject) {
            $subject->units()->save($unit);
            $this->apiResponse['message'] = trans('quiz::messages.unit_update');
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
    public function delete(UnitRequest $request) {
        $unit = Unit::where('guid', $request->guid)->first();
        $unit->delete();
        $this->apiResponse['message'] = trans('quiz::messages.unit_delete');
        return $this->sendResponse();
    }

}
