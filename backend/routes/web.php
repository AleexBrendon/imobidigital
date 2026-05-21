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

Route::get('/debug-error', function () {
    return response()->json([
        'app' => config('app.name'),
        'env' => app()->environment(),
        'db' => config('database.default'),
        'host' => config('database.connections.pgsql.host'),
    ]);
});
