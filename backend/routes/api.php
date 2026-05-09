<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\PropertyNegotiationController;
use App\Http\Controllers\Api\PropertyVisitController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    //USER ROUTES
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('users', UserController::class)->only([
        'index',
        'store',
        'update',
        'destroy',
    ]);
    //CLIENTS ROUTES
    Route::apiResource('clients', ClientController::class);
    Route::get('/clients/{client}/activities', [ClientController::class, 'activities']);
    Route::get('/clients/{client}/documents', [ClientController::class, 'documents']);
    Route::get('/clients/{client}/contracts', [ClientController::class, 'contracts']);
    Route::get('/clients/{client}/properties', [ClientController::class, 'properties']);
    //DOCUMENTS ROUTES
    Route::apiResource('documents', DocumentController::class);
    Route::get('/documents/{document}/download', [DocumentController::class, 'download']);
    //PROPERTIES ROUTES
    Route::apiResource('properties', PropertyController::class);
    //NEGOTIATIONS ROUTES
    Route::get('/property-negotiations', [PropertyNegotiationController::class, 'index']);
    Route::post('/properties/{property}/negotiations', [PropertyNegotiationController::class, 'store']);
    Route::get('/property-negotiations/{negotiation}', [PropertyNegotiationController::class, 'show']);
    Route::put('/property-negotiations/{negotiation}', [PropertyNegotiationController::class, 'update']);
    Route::delete('/property-negotiations/{negotiation}', [PropertyNegotiationController::class, 'destroy']);
    Route::middleware('auth:sanctum')->patch(
        '/property-negotiations/{propertyNegotiation}/stage',
        [PropertyNegotiationController::class, 'updateStage']
    );
    //VISITS ROUTES
    Route::get('/property-visits', [PropertyVisitController::class, 'index']);
    Route::post('/properties/{property}/visits', [PropertyVisitController::class, 'store']);
    Route::get('/property-visits/{visit}', [PropertyVisitController::class, 'show']);
    Route::put('/property-visits/{visit}', [PropertyVisitController::class, 'update']);
    Route::delete('/property-visits/{visit}', [PropertyVisitController::class, 'destroy']);
    //CONTRACTS ROUTES
    Route::apiResource('contracts', ContractController::class);
    Route::patch('/signature-steps/{signatureStep}', [ContractController::class, 'updateSignatureStep']);
    Route::patch('/contract-clauses/{clause}', [ContractController::class, 'updateClauseStatus']);
    //ACTIVITIES ROUTES
    Route::apiResource('activities', ActivityController::class)->only([
        'index',
        'store',
        'show',
        'destroy',
    ]);
    //NOTIFICATIONS ROUTES
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::apiResource('notifications', NotificationController::class)->only([
        'index',
        'store',
        'show',
        'destroy',
    ]);
    //REPORTS ROUTES
    Route::get('/reports', [ReportController::class, 'index']);
    //DASHBOARD ROUTES
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
