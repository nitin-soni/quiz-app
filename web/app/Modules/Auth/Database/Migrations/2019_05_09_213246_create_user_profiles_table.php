<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->date('dob')->nullable();
            $table->enum('gender', ['male', 'female', 'others'])->nullable();
            $table->string('profile_image')->nullable();
            $table->string('profile_cover')->nullable();
            $table->ipAddress('registered_from_ip')->nullable();
            //location data
            $table->string('location')->nullable();
            $table->double('latitude')->nullable();
            $table->double('longitude')->nullable();
            $table->integer('country_id')->unsigned()->nullable();
            $table->integer('state_id')->unsigned()->nullable();
            $table->integer('city_id')->unsigned()->nullable();
            $table->foreign('country_id')->references('id')->on('master_countries');
            $table->foreign('state_id')->references('id')->on('master_states');
            $table->foreign('city_id')->references('id')->on('master_cities');
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
        Schema::dropIfExists('user_profiles');
    }
}
