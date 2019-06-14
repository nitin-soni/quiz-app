<?php

namespace App\Modules\Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model {

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'description'];
    public $timestamps = true;
    protected $hidden = ['id'];

    /**
     * Get the Units for the subject.
     */
    public function units()
    {
        return $this->hasMany('App\Modules\Quiz\Models\Unit', 'subject_id', 'id');
    }
}
