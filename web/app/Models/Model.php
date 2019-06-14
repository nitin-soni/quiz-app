<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as LaravelModel;
use Request;

/**
 * Description of Model
 *
 * @author Nitin Kumar Soni
 */
class Model extends LaravelModel {

    protected $hidden = ['id'];

    public function __construct(array $attributes = array()) {
        parent::__construct($attributes);
    }
    
}
