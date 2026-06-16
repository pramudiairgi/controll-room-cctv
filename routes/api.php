<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CctvController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::name('api.v1.')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1')
        ->name('auth.login');

    Route::get('/cctvs/map', [CctvController::class, 'map'])->name('cctvs.map');
    Route::get('/cctvs', [CctvController::class, 'index'])->name('cctvs.index');
    Route::get('/cctvs/{cctv}', [CctvController::class, 'show'])->name('cctvs.show');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::get('/auth/me', [AuthController::class, 'me'])->name('auth.me');

        Route::patch('/cctvs/{cctv}/status', [CctvController::class, 'updateStatus'])->name('cctvs.status');
        Route::post('/cctvs/{cctv}/youtube', [CctvController::class, 'updateYoutubeUrl'])->name('cctvs.youtube');
        Route::post('/cctvs', [CctvController::class, 'store'])->name('cctvs.store');
        Route::patch('/cctvs/{cctv}', [CctvController::class, 'update'])->name('cctvs.update');
        Route::delete('/cctvs/{cctv}', [CctvController::class, 'destroy'])->name('cctvs.destroy');

        Route::apiResource('users', UserController::class)->except(['create', 'edit']);
    });
});
