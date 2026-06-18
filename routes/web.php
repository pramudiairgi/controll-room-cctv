<?php

use Illuminate\Support\Facades\Route;

Route::get('/login', function () {
    return response()->file(public_path('login/index.html'));
})->name('login');

Route::get('/{any?}', function () {
    return response()->file(public_path('index.html'));
})->where('any', '.*');
