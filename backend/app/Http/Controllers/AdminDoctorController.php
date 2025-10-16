<?php

namespace App\Http\Controllers;

use App\Http\Resources\DoctorResource;
use App\Http\Resources\DoctorSimpleResource;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
            ->paginate(10)
            ->appends($request->query()); // da se query parametri zadrže pri paginaciji

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
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'specialty_id' => 'nullable|exists:specializations,id',
            'new_specialty_name' => 'nullable|string|max:255',
            'new_specialty_color' => 'nullable|string|max:7',
        ]);

        // Ako admin šalje novu specijalnost
        if ($request->filled('new_specialty_name') && $request->filled('new_specialty_color')) {
            $specialty = Specialization::create([
                'name' => $request->new_specialty_name,
                'color' => $request->new_specialty_color,
            ]);
            $specialtyId = $specialty->id;
        } else {
            $specialtyId = $request->specialty_id;
        }

        $doctor = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => 'doctor',
            'specialty_id' => $specialtyId,
        ]);

        return response()->json([
            'message' => 'Doctor created successfully',
            'doctor' => new DoctorSimpleResource($doctor)
        ], 201);
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
        $doctor = User::where('role', 'doctor')->findOrFail($id);

        $hasAppointments = $doctor->appointmentsAsDoctor()->whereIn('status', ['scheduled', 'completed'])->exists();
        if ($hasAppointments) {
            return response()->json([
                'message' => 'Cannot delete doctor with scheduled or completed appointments.'
            ], 400);
        }
        $deletedDoctor = new DoctorSimpleResource($doctor);
        $doctor->delete();

        return response()->json([
            'message' => 'Doctor deleted successfully.',
            'doctor' => $deletedDoctor
        ]);
    }
}
