<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::get('/run-migrate-secret-123', function () {
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('migrate', [
        '--force' => true,
    ]);

    return nl2br(Artisan::output());
});