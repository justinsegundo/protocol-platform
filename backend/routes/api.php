<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ProtocolController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\ThreadController;
use App\Http\Controllers\Api\VoteController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

Route::get('protocols', [ProtocolController::class, 'index']);
Route::get('protocols/{protocol}', [ProtocolController::class, 'show']);

Route::get('threads', [ThreadController::class, 'index']);
Route::get('threads/{thread}', [ThreadController::class, 'show']);

Route::get('threads/{thread}/comments', [CommentController::class, 'index']);

Route::get('search', [SearchController::class, 'search']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('protocols', [ProtocolController::class, 'store']);
    Route::put('protocols/{protocol}', [ProtocolController::class, 'update']);
    Route::delete('protocols/{protocol}', [ProtocolController::class, 'destroy']);

    Route::post('threads', [ThreadController::class, 'store']);
    Route::put('threads/{thread}', [ThreadController::class, 'update']);
    Route::delete('threads/{thread}', [ThreadController::class, 'destroy']);

    Route::post('threads/{thread}/comments', [CommentController::class, 'store']);
    Route::put('threads/{thread}/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('threads/{thread}/comments/{comment}', [CommentController::class, 'destroy']);

    Route::post('protocols/{protocol}/reviews', [ReviewController::class, 'store']);
    Route::put('protocols/{protocol}/reviews', [ReviewController::class, 'update']);
    Route::delete('protocols/{protocol}/reviews', [ReviewController::class, 'destroy']);

    Route::post('votes', [VoteController::class, 'vote']);
});