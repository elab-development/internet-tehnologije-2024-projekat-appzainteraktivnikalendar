<?php

namespace App\Http\Controllers;

use App\Http\Resources\DoctorResource;
use App\Http\Resources\DoctorSimpleResource;
use App\Models\Specialization;
use App\Models\User;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Log;

class AdminDoctorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $specialtyId = $request->query('specialty_id');

        $query = User::with('specialization')
            ->where('role', 'doctor');

        // Filter po specijalnosti
        if ($specialtyId) {
            $query->where('specialty_id', $specialtyId);
        }

        // Search po ime/prezime/email/phone
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $doctors = $query->orderBy('last_name', 'asc')
            ->orderBy('first_name', 'asc')
            ->paginate(10);

        return DoctorSimpleResource::collection($doctors);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Definišemo pravila validacije
        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        $request->validate([
            // Osnovni podaci za User model
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'string|max:20',
            'specialty_id' => 'exists:specializations,id',

            // Validacija za doctor_schedules
            'schedules' => 'nullable|array',
            'schedules.*.day_of_week' => [
                'required',
                'string',
                Rule::in($days), // Proverava da li je dan validan
            ],
            'schedules.*.start_time' => 'required|date_format:H:i',
            'schedules.*.end_time' => 'required|date_format:H:i|after:schedules.*.start_time',
        ]);

        // Koristimo transakciju baze podataka
        try {
            DB::beginTransaction();

            // 2. Kreiranje User (Doctor) modela
            $doctor = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'role' => 'doctor',
                'specialty_id' => $request->specialty_id,
            ]);

            // 3. Dodavanje Doctor Schedules (Radnog Vremena)
            if (!empty($request->schedules)) {
                $schedulesToInsert = [];
                foreach ($request->schedules as $schedule) {
                    $schedulesToInsert[] = [
                        'doctor_id' => $doctor->id,
                        'day_of_week' => $schedule['day_of_week'],
                        'start_time' => $schedule['start_time'],
                        'end_time' => $schedule['end_time'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                $doctor->doctorSchedules()->insert($schedulesToInsert);
            }

            DB::commit();

            // 4. Vraćanje odgovora
            return response()->json([
                'message' => 'Doktor i radno vreme uspešno dodati.',
                'doctor' => new DoctorSimpleResource($doctor->load('specialization'))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error("Greška pri kreiranju doktora: " . $e->getMessage());
            return response()->json(['message' => 'Došlo je do greške pri čuvanju podataka.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $doctor = User::where('role', 'doctor')->with('specialization', 'doctorSchedules')->findOrFail($id);
        return new DoctorResource($doctor);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
