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

    public function __construct(array $attributes = array()) {
        parent::__construct($attributes);
        if (Request::get('subdomainName')) {
            // Set the database connection name.
            $this->setConnection('companydb');
        }
    }

}
