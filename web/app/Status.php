<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Status extends Model {

    const ACTIVE = 1;
    const BLOCKED = 2;
    const DEACTIVE = 3;
    const PENDING = 4;

}
