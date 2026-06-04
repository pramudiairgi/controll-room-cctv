<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CctvController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::name('api.v1.')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login'])->name('auth.login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::get('/auth/me', [AuthController::class, 'me'])->name('auth.me');

        Route::get('/cctvs/map', [CctvController::class, 'map'])->name('cctvs.map');
        Route::patch('/cctvs/{cctv}/status', [CctvController::class, 'updateStatus'])->name('cctvs.status');
        Route::post('/cctvs/{cctv}/youtube', [CctvController::class, 'updateYoutubeUrl'])->name('cctvs.youtube');
        Route::apiResource('cctvs', CctvController::class)->except(['create', 'edit']);

        Route::apiResource('users', UserController::class)->except(['create', 'edit']);
    });
});
