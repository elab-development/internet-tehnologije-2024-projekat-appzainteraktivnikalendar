<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ZA SVE PRIJAVLJENE
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // PACIJENT RUTE
    Route::prefix('patient')->middleware('role:patient')->group(function () {
        Route::get('/appointments', [AppointmentController::class, 'getPatientAppointments']);
        Route::get('/available-specializations', [AppointmentController::class, 'getAvailableSpecializations']);

    });

    // DOKTOR RUTE
    Route::prefix('doctor')->middleware('role:doctor')->group(function () {
        // npr. Route::get('/appointments', [AppointmentController::class, 'getDoctorAppointments']);
    });

    // DMIN RUTE
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        // npr. Route::post('/create-doctor', [AdminController::class, 'createDoctor']);
    });
});
