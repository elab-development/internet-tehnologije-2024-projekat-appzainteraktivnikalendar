<?php

use App\Http\Controllers\AdminDoctorController;
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
        // Izmena termina
        Route::put('/appointments/{appointment_id}', [AppointmentController::class, 'updateAppointment']);
        // poništavanje termina
        Route::post('/appointments/{appointment_id}/cancel', [AppointmentController::class, 'cancelAppointment']);
        // eksport termina u .ics fajl
        Route::get('/appointments/export', [AppointmentController::class, 'exportAppointments']);
        // istorija pregleda
        Route::get('/history', [AppointmentController::class, 'getAppointmentHistory']);
    });

    // DOKTOR RUTE
    Route::prefix('doctor')->middleware('role:doctor')->group(function () {
        // prikaz licnog kalendara
        Route::get('/appointments', [AppointmentController::class, 'getDoctorAppointments']);
        // odbijanje termina
        Route::post('/appointments/{appointment}/reject', [AppointmentController::class, 'rejectAppointment']);
        // završavanje termina, tj. unos napomene
        Route::post('/appointments/{appointment}/complete', [AppointmentController::class, 'completeAppointment']);
        // prikaz liste prethodnih pregleda
        Route::get('/history', [AppointmentController::class, 'getCompletedAppointments']);
    });

    // ADMIN RUTE
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        // rest
        Route::resource('doctors', AdminDoctorController::class)->only(['index', 'show', 'store', 'destroy']);
    });
});
