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
Route::post('subject', 'Api\SubjectController@save')->middleware('auth:api');
Route::get('subject/{guid?}', 'Api\SubjectController@get');//->middleware('auth:api');
Route::put('subject', 'Api\SubjectController@update')->middleware('auth:api');
Route::delete('subject', 'Api\SubjectController@delete')->middleware('auth:api');

Route::post('unit', 'Api\UnitController@save')->middleware('auth:api');
Route::get('unit/{guid?}', 'Api\UnitController@get');//->middleware('auth:api');
Route::put('unit', 'Api\UnitController@update')->middleware('auth:api');
Route::delete('unit', 'Api\UnitController@delete')->middleware('auth:api');

Route::post('topic', 'Api\TopicController@save')->middleware('auth:api');
Route::get('topic/{guid?}', 'Api\TopicController@get');//->middleware('auth:api');
Route::put('topic', 'Api\TopicController@update')->middleware('auth:api');
Route::delete('topic', 'Api\TopicController@delete')->middleware('auth:api');

Route::post('question', 'Api\QuestionController@save')->middleware('auth:api');
Route::get('question/{guid?}', 'Api\QuestionController@get')->middleware('auth:api');
Route::put('question', 'Api\QuestionController@update')->middleware('auth:api');
Route::delete('question', 'Api\QuestionController@delete')->middleware('auth:api');

Route::post('quiz', 'Api\QuizController@save')->middleware('auth:api');
Route::get('quiz/{guid?}', 'Api\QuizController@get')->middleware('auth:api');
Route::put('quiz', 'Api\QuizController@update')->middleware('auth:api');
Route::delete('quiz', 'Api\QuizController@delete')->middleware('auth:api');
Route::post('quiz/assign-question', 'Api\QuizController@assignQuestions')->middleware('auth:api');
Route::get('quiz/questions/{guid}', 'Api\QuizController@getQuestions');//->middleware('auth:api');