<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Specialization;
use App\Models\DoctorSchedule;
use App\Models\Appointment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Carbon\Carbon;

class AppointmentTest extends TestCase
{
    use RefreshDatabase;

    private $doctor;
    private $patient;
    private $specialization;

    protected function setUp(): void
    {
        parent::setUp();

        $this->specialization = Specialization::create([
            'name' => 'Cardiology'
        ]);

        $this->doctor = User::create([
            'first_name' => 'John',
            'last_name' => 'Doctor',
            'email' => 'doctor@test.com',
            'password' => bcrypt('password'),
            'role' => 'doctor',
            'phone' => '123456',
            'specialty_id' => $this->specialization->id,
        ]);

        $this->patient = User::create([
            'first_name' => 'Jane',
            'last_name' => 'Patient',
            'email' => 'patient@test.com',
            'password' => bcrypt('password'),
            'role' => 'patient',
            'phone' => '999999',
        ]);

        DoctorSchedule::create([
            'doctor_id' => $this->doctor->id,
            'day_of_week' => 'monday',
            'start_time' => '08:00:00',
            'end_time' => '16:00:00',
        ]);
    }

    /** @test */
    public function patient_can_book_appointment_successfully()
    {
        Sanctum::actingAs($this->patient);

        $monday = Carbon::parse('next monday 09:00');

        $response = $this->postJson('/api/patient/appointments', [
            'doctor_id' => $this->doctor->id,
            'start_time' => $monday->format('Y-m-d H:i'),
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('appointments', [
            'doctor_id' => $this->doctor->id,
            'patient_id' => $this->patient->id,
        ]);
    }

    /** @test */
    public function system_prevents_double_booking_same_time_slot()
    {
        Sanctum::actingAs($this->patient);

        $time = Carbon::parse('next monday 10:00');

        Appointment::create([
            'doctor_id' => $this->doctor->id,
            'patient_id' => $this->patient->id,
            'start_time' => $time,
            'end_time' => $time->copy()->addMinutes(30),
            'status' => 'scheduled',
        ]);

        $response = $this->postJson('/api/patient/appointments', [
            'doctor_id' => $this->doctor->id,
            'start_time' => $time->format('Y-m-d H:i'),
        ]);

        $response->assertStatus(400);
    }

    /** @test */
    public function patient_cannot_cancel_appointment_less_than_one_hour_before()
    {
        Sanctum::actingAs($this->patient);

        $time = Carbon::now()->addMinutes(30);

        $appointment = Appointment::create([
            'doctor_id' => $this->doctor->id,
            'patient_id' => $this->patient->id,
            'start_time' => $time,
            'end_time' => $time->copy()->addMinutes(30),
            'status' => 'scheduled',
        ]);

        $response = $this->postJson("/api/patient/appointments/{$appointment->id}/cancel");

        $response->assertStatus(400);
    }

    /** @test */
    public function cannot_book_appointment_outside_doctor_schedule()
    {
        Sanctum::actingAs($this->patient);

        $time = Carbon::parse('next monday 20:00');

        $response = $this->postJson('/api/patient/appointments', [
            'doctor_id' => $this->doctor->id,
            'start_time' => $time->format('Y-m-d H:i'),
        ]);

        $response->assertStatus(400);
    }

    /** @test */
    public function race_condition_simulation_prevents_duplicate_slots()
    {
        Sanctum::actingAs($this->patient);

        $time = Carbon::parse('next monday 11:00');

        Appointment::create([
            'doctor_id' => $this->doctor->id,
            'patient_id' => $this->patient->id,
            'start_time' => $time,
            'end_time' => $time->copy()->addMinutes(30),
            'status' => 'scheduled',
        ]);

        $response = $this->postJson('/api/patient/appointments', [
            'doctor_id' => $this->doctor->id,
            'start_time' => $time->format('Y-m-d H:i'),
        ]);

        $response->assertStatus(400);
    }
}