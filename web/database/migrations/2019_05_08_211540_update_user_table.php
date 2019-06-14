<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUserTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('guid')->unique()->after('id');
            $table->string('phone_number')->after('email')->nullable()->unique();
            $table->renameColumn('name', 'username')->unique()->change();
            $table->integer('status_id')->unsigned();
            $table->foreign('status_id')->references('id')->on('statuses');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('username', 'name')->unique()->change();
            $table->dropColumn('guid');
            $table->dropForeign('users_status_id_foreign');
            $table->dropColumn('status_id');
        });
    }

}
