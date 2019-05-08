<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMasterStatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('master_states', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 200);
            $table->string('short_name', 200)->default(null)->nullable();
            $table->integer('country_id')->unsigned()->nullable();
            $table->foreign('country_id')->references('id')->on('master_countries');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('master_states');
    }
}
