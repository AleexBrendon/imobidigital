<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return response()->json([
        'status' => 'Backend online'
    ]);
});

Route::get('/debug-error', function () {
    return response()->json([
        'app' => config('app.name'),
        'env' => app()->environment(),
        'db' => config('database.default'),
        'host' => config('database.connections.pgsql.host'),
    ]);
});
