<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your module. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('user', 'Api\UserController@save')->middleware('auth:api');
Route::get('user/{guid?}', 'Api\UserController@get')->middleware('auth:api');
Route::put('user', 'Api\UserController@update')->middleware('auth:api');
Route::delete('user', 'Api\UserController@delete')->middleware('auth:api');
Route::put('user/toggle-status', 'Api\UserController@toggleUserStatus')->middleware('auth:api');
