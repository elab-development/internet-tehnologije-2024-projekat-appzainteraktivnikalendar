<?php

namespace App\Http\Controllers;

use App\Models\Specialization;
use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Http\Resources\PatientAppointmentResource;
use Illuminate\Support\Facades\Auth;

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
}