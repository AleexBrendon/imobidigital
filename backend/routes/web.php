<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return response()->json([
        'status' => 'Backend online'
    ]);
});

Route::get('/run-migrate-secret-123', function () {
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('migrate', [
        '--force' => true
    ]);

    return '<pre>' . Artisan::output() . '</pre>';
});