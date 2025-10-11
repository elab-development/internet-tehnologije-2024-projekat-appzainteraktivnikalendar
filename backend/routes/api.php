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
        // prikaz licnog kalendara
        Route::get('/appointments', [AppointmentController::class, 'getPatientAppointments']);
        // Zakazivanje
        Route::get('/available-specializations', [AppointmentController::class, 'getAvailableSpecializations']);
        Route::get('/available-doctors', [AppointmentController::class, 'getAvailableDoctors']);
        Route::get('/doctors/{doctor_id}/available-times', [AppointmentController::class, 'getAvailableTimes']);
        Route::post('/appointments', [AppointmentController::class, 'bookAppointment']);
        Route::put('/appointments/{appointment_id}', [AppointmentController::class, 'updateAppointment']);
    });

    // DOKTOR RUTE
    Route::prefix('doctor')->middleware('role:doctor')->group(function () {
        // npr. Route::get('/appointments', [AppointmentController::class, 'getDoctorAppointments']);
    });

    // ADMIN RUTE
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        // npr. Route::post('/create-doctor', [AdminController::class, 'createDoctor']);
    });
});
