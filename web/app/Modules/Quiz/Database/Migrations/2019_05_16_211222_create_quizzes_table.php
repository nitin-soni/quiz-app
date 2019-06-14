<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuizzesTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('guid')->unique();
            $table->string('name', 251);
            $table->text('description')->nullable(true);
            $table->enum('level', ['easy', 'medium', 'hard'])->default('easy');
            $table->enum('type', ['no_limit', 'time_based', 'time_per_question'])->default('no_limit');
            $table->integer('total_question')->unsigned();
            $table->integer('quiz_time')->unsigned()->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('quizzes');
    }

}
