<?php

namespace App\Http\Controllers;

use App\Models\DoctorSchedule;
use App\Models\Specialization;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Http\Resources\PatientAppointmentResource;
use Illuminate\Support\Facades\Auth;
use Log;

class AppointmentController extends Controller
{
    public function getPatientAppointments(Request $request)
    {
        $user = Auth::user();

        // 1️⃣ Upit za termine pacijenta
        $query = Appointment::with('doctor.specialization')
            ->where('patient_id', $user->id)
            ->orderBy('start_time', 'asc');

        // 2️⃣ Filtriranje po jednoj ili više specijalnosti (SK4)
        if ($request->filled('specialization_ids')) {
            $query->whereHas('doctor.specialization', function ($q) use ($request) {
                $q->whereIn('id', $request->specialization_ids);
            });
        }

        $appointments = $query->get();

        // 3️⃣ Vraćamo sve specijalnosti lekara (ne filtrirane)
        $specializations = Specialization::select('id', 'name', 'color')->get();

        // 4️⃣ Vraćamo sve zajedno
        return response()->json([
            'appointments' => PatientAppointmentResource::collection($appointments),
            'specializations' => $specializations
        ]);
    }

    public function getAvailableSpecializations(Request $request)
    {
        $date = $request->query('date');

        if (!$date) {
            return response()->json(['message' => 'Date is required.'], 400);
        }

        // Odredjujemo dan u nedelji (monday, tuesday...)
        $dayOfWeek = strtolower(Carbon::parse($date)->format('l'));

        // Tražimo sve lekare koji rade tog dana
        $doctorIds = DoctorSchedule::where('day_of_week', $dayOfWeek)
            ->pluck('doctor_id')
            ->unique();

        if ($doctorIds->isEmpty()) {
            return response()->json(['message' => 'No doctors available that day.'], 200);
        }

        // Uzimamo sve specijalizacije koje ti doktori imaju
        $specializations = Specialization::whereIn('id', function ($query) use ($doctorIds) {
            $query->select('specialty_id')
                ->from('users')
                ->whereIn('id', $doctorIds)
                ->whereNotNull('specialty_id');
        })
            ->get(['id', 'name']);

        if ($specializations->isEmpty()) {
            return response()->json(['message' => 'No specializations available that day.'], 200);
        }

        return response()->json($specializations);
    }

    public function getAvailableDoctors(Request $request)
    {
        $date = $request->query('date');
        $specializationId = $request->query('specialization_id');

        if (!$date || !$specializationId) {
            return response()->json(['message' => 'Date and specialization_id are required.'], 400);
        }

        $dayOfWeek = strtolower(Carbon::parse($date)->format('l'));
        // Lekari koji rade tog dana
        $doctorIds = DoctorSchedule::where('day_of_week', $dayOfWeek)
            ->pluck('doctor_id')
            ->unique();

        // Filtriramo samo one sa izabranom specijalnošću
        $availableDoctors = User::whereIn('id', $doctorIds)
            ->where('role', 'doctor')
            ->where('specialty_id', $specializationId)
            ->get(['id', 'first_name', 'last_name']);

        if ($availableDoctors->isEmpty()) {
            return response()->json(['message' => 'No doctors available for this specialization on this date.'], 200);
        }

        return response()->json($availableDoctors);
    }

}