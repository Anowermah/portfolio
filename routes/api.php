<?php

use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientProjectController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/settings', [SettingController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected Routes (Logged in Users / Clients / Admin)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'updatePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Client Dashboard & Orders
    Route::get('/client/projects', [ClientProjectController::class, 'clientProjects']);
    Route::post('/client/projects', [ClientProjectController::class, 'clientStoreProject']);
    Route::patch('/client/projects/{id}/accept', [ClientProjectController::class, 'clientAcceptDelivery']);

    // Admin Only Protected Routes (Guarded by EnsureAdmin Middleware)
    Route::middleware('admin')->group(function () {
        // Admin Dashboard & Messages
        Route::get('/admin/dashboard', [AdminDashboardController::class, 'stats']);
        Route::get('/admin/users', [AdminDashboardController::class, 'users']);
        Route::patch('/admin/users/{id}/role', [AdminDashboardController::class, 'updateUserRole']);
        Route::get('/admin/messages', [ContactController::class, 'index']);
        Route::patch('/admin/messages/{id}/read', [ContactController::class, 'markAsRead']);
        Route::delete('/admin/messages/{id}', [ContactController::class, 'destroy']);

        // Admin Marketplace Order & Project Management
        Route::get('/admin/projects', [ClientProjectController::class, 'adminProjects']);
        Route::post('/admin/projects', [ClientProjectController::class, 'adminStoreProject']);
        Route::put('/admin/projects/{id}', [ClientProjectController::class, 'adminUpdateProject']);
        Route::delete('/admin/projects/{id}', [ClientProjectController::class, 'adminDeleteProject']);
        Route::get('/admin/clients', [ClientProjectController::class, 'adminClients']);

        // Site Customization Settings
        Route::post('/admin/settings', [SettingController::class, 'update']);
        Route::post('/admin/upload', [SettingController::class, 'upload']);
    });
});
