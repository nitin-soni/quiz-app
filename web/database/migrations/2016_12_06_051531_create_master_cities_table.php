<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMasterCitiesTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('master_cities', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 200);
            $table->char('zip_code', 5)->nullable();
            $table->integer('country_id')->unsigned()->nullable();
            $table->foreign('country_id')->references('id')->on('master_countries');
            $table->integer('state_id')->unsigned()->nullable();
            $table->foreign('state_id')->references('id')->on('master_states');

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
        Schema::dropIfExists('master_cities');
    }

}
