<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('guid')->unique();
            $table->text('question');
            $table->text('description')->nullable(true);
            $table->bigInteger('unit_topic_id')->unsigned();
            $table->foreign('unit_topic_id')->references('id')->on('topics')->onDelete('cascade');
            $table->enum('level', ['easy', 'medium', 'hard'])->default('easy');
            $table->enum('type', ['single_choice', 'multiple_choice'])->default('single_choice');
            $table->softDeletes();
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
        Schema::dropIfExists('questions');
    }
}
