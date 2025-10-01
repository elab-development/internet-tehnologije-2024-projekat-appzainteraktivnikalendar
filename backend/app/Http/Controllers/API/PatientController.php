<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use Illuminate\Http\Request;
use App\Models\Appointment;

class PatientController extends Controller
{
    public function myCalendar(Request $request)
    {
        $user = $request->user(); // Authovan pacijent

        // Učitavamo sve termine pacijenta sa lekarom i specijalizacijom
        $appointments = Appointment::with([
            'doctor.specializations'
        ])
        ->where('patient_id', $user->id)
        ->get();

        if($appointments->isEmpty()){
            return response()->json([
                'message' => 'Nemate zakazane termine.'
            ]);
        }

        // Vraćamo termine
        return AppointmentResource::collection($appointments);
    }
}