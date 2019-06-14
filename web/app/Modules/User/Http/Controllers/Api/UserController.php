<?php

namespace App\Modules\User\Http\Controllers\Api;

use App\Modules\User\Http\Requests\UserRequest;
use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\User;
use App\Status;
use App\Modules\Auth\Models\UserProfile;
use App\Modules\User\Http\Requests\ToggleUserRequest;
use Hash;
use Illuminate\Support\Str;
use App\Modules\User\Notifications\WelcomeEmail;

class UserController extends ApiController {

    public function save(UserRequest $request) {
        $random = Str::random(8);

        $user = new User();
        $user->guid = \Ramsey\Uuid\Uuid::uuid4();
        $user->username = $request->email;
        $user->email = $request->email;
        $user->phone_number = $request->phone_number;
        $user->password = Hash::make('123456');
        $user->status_id = Status::ACTIVE;
        $user->save();

        //now create user profile
        $ipAddress = $request->ip();
        $userProfile = new \App\Modules\Auth\Models\UserProfile();
        $userProfile->first_name = $request->first_name;
        $userProfile->last_name = $request->last_name;
        $userProfile->gender = $request->gender;
        $userProfile->dob = $request->dob;
        $userProfile->registered_from_ip = $ipAddress;

        //save profile to user
        $user->profile()->save($userProfile);

        //attach role
        $role = \App\Role::where('name', '=', $request->user_role)->first();
        $user->attachRole($role);
        
        $user->notify(new WelcomeEmail($user, $random));

        $this->apiResponse['message'] = trans('user::messages.user_success');
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
        return [];
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
        $userId = 1; //$request->user()->id;

        $userTable = User::getTableName();
        $userProfileTable = UserProfile::getTableName();

        $users = User::join($userProfileTable . ' AS UF', $userTable . '.id', '=', 'UF.user_id')
                ->where($userTable . '.id', '!=', $userId);
        if ($sortBy == 'name') {
            $users = $users->orderBy('first_name', $sortOrder);
            $users = $users->orderBy('last_name', $sortOrder);
        } else {
            $users->orderBy($sortBy, $sortOrder);
        }

        if ($params && is_array($params)) {
            //$users = $users->where(function ($query) use($params) {
            foreach ($params as $field => $val) {
                if ($field == 'status') {
                    if (($val == 'all' || $val == 'ALL')) {
                        continue;
                    }
                    $field = 'status_id';
                    $val = strtolower($val);
                    $val = \App\Status::VAL_ARRAY[$val];
//                    echo $val;die;
                    $users = $users->where('status_id', $val);
                } if ($field == 'role') {
                    if (($val == 'all' || $val == 'ALL')) {
                        continue;
                    }
                    $users->whereHas('roles', function ($query) use ($val) {
                        $query->where('name', '=', $val);
                    });
                } else if ($field == 'name') {
                    $users = $users->where('first_name', 'like', '%' . $val . '%');
                    $users = $users->orWhere('last_name', 'like', '%' . $val . '%');
                } else {
                    $users = $users->where($field, 'like', '%' . $val . '%');
                }
            }
            //});
        }

        $list = $users->paginate($perPage);
        $data = [];
        foreach ($list as $key => $item) {
            //$roles = $item->roles->toArray();
            $role = $item->roles->first();
            $data[] = [
                's_no' => $pageOffset + $key,
                'guid' => $item->guid,
                'email' => $item->email,
                'phone_number' => $item->phone_number,
                'username' => $item->username,
                'first_name' => $item->profile->first_name,
                'last_name' => $item->profile->last_name,
                'gender' => $item->profile->gender,
                'status' => $item->status->name,
                'role' => [
                    'display_name' => $role->display_name,
                    'name' => $role->name,
                ]
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
    public function update(UserRequest $request) {
        $user = User::where('guid', $request->guid)->first();
        $user->email = $request->email;
        $user->phone_number = $request->phone_number;
        $user->profile->first_name = $request->first_name;
        $user->profile->last_name = $request->last_name;
        $user->profile->gender = $request->gender;
        $user->push();

        //update role
        $role = \App\Role::where('name', $request->user_role)->first();
        $user->roles()->sync([$role->id]);

        $this->apiResponse['message'] = trans('user::messages.user_update');
        return $this->sendResponse();
    }

    /**
     * 
     * @param Request $request
     * @return type
     */
    public function delete(UserRequest $request) {
        User::where('guid', $request->guid)->delete();
        $this->apiResponse['message'] = trans('user::messages.user_delete');
        return $this->sendResponse();
    }

    public function toggleUserStatus(ToggleUserRequest $request) {
        $user = User::where('guid', $request->guid)->first();
        if ($user->status_id == Status::ACTIVE) {
            $user->status_id = Status::DEACTIVE;
            $this->apiResponse['message'] = trans('user::messages.user_deactivated');
        } else {
            $user->status_id = Status::ACTIVE;
            $this->apiResponse['message'] = trans('user::messages.user_activated');
        }
        $user->save();
        return $this->sendResponse();
    }

}
