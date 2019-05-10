<?php

use Illuminate\Http\Request;

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

Route::post('auth/signin', 'Api\SigninController@index')->middleware('throttle:10');
Route::post('auth/signup', 'api\SignupController@index')->middleware('throttle:10');
Route::post('auth/forgot-password', 'api\ForgotPasswordController@sendResetLinkEmail')->middleware('throttle:10');
Route::post('auth/reset-password', 'api\ResetPasswordController@reset')->middleware('throttle:10');