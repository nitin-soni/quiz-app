<?php

namespace App\Models;

/**
 *
 * @author Nitin Kumar Soni
 */
trait EloquentGetTableNameTrait {

    public static function getTableName() {
        return ((new self)->getTable());
    }

}
