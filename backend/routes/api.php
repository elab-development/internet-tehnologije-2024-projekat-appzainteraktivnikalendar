<?php

use App\Http\Controllers\AdminDoctorController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicHolidayController;
use App\Http\Controllers\SpecializationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/**
 * --------------------------------------------------------------------------
 * JAVNE RUTE (PUBLIC ROUTES)
 * --------------------------------------------------------------------------
 * Rute dostupne svima (registracija, prijava, praznici).
 */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/public-holidays', [PublicHolidayController::class, 'index']);


/**
 * --------------------------------------------------------------------------
 * AUTENTIFIKOVANE RUTE (AUTHENTICATED ROUTES)
 * --------------------------------------------------------------------------
 * Rute dostupne samo prijavljenim korisnicima.
 */
Route::middleware('auth:sanctum')->group(function () {
    // LOGOUT
    Route::post('/logout', [AuthController::class, 'logout']);

    /**
     * ----------------------------------------------------------------------
     * RUTE ZA PACIJENTE
     * ----------------------------------------------------------------------
     * Rute dostupne samo korisnicima sa ulogom 'patient'.
     */
    Route::prefix('patient')->middleware('role:patient')->group(function () {
        // LIČNI KALENDAR I TERMINI
        Route::get('/appointments', [AppointmentController::class, 'getPatientAppointments']);

        // ZAKAZIVANJE
        Route::get('/available-specializations', [AppointmentController::class, 'getAvailableSpecializations']);
        Route::get('/available-doctors', [AppointmentController::class, 'getAvailableDoctors']);
        Route::get('/doctors/{doctor_id}/available-times', [AppointmentController::class, 'getAvailableTimes']);
        Route::post('/appointments', [AppointmentController::class, 'bookAppointment']);

        // UPRAVLJANJE TERMINIMA
        Route::put('/appointments/{appointment_id}', [AppointmentController::class, 'updateAppointment']);
        Route::post('/appointments/{appointment_id}/cancel', [AppointmentController::class, 'cancelAppointment']);

        // ISTORIJA I EKSPORT
        Route::get('/appointments/export', [AppointmentController::class, 'exportAppointments']);
        Route::get('/history', [AppointmentController::class, 'getAppointmentHistory']);
    });

    /**
     * ----------------------------------------------------------------------
     * RUTE ZA DOKTORE
     * ----------------------------------------------------------------------
     * Rute dostupne samo korisnicima sa ulogom 'doctor'.
     */
    Route::prefix('doctor')->middleware('role:doctor')->group(function () {
        // LIČNI KALENDAR I TERMINI
        Route::get('/appointments', [AppointmentController::class, 'getDoctorAppointments']);

        // UPRAVLJANJE TERMINIMA
        Route::post('/appointments/{appointment}/reject', [AppointmentController::class, 'rejectAppointment']);
        Route::post('/appointments/{appointment}/complete', [AppointmentController::class, 'completeAppointment']);

        // ISTORIJA
        Route::get('/history', [AppointmentController::class, 'getCompletedAppointments']);
    });

    /**
     * ----------------------------------------------------------------------
     * RUTE ZA ADMINISTRATORE
     * ----------------------------------------------------------------------
     * Rute dostupne samo korisnicima sa ulogom 'admin'.
     */
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        // RESURSI
        Route::get('/specializations', [SpecializationController::class, 'getSpecializations']);
        Route::resource('doctors', AdminDoctorController::class)->only(['index', 'show', 'store']);
    });
});
