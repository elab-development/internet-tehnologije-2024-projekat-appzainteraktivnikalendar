<?php

namespace App\Http\Controllers;

use App\Http\Resources\DoctorResource;
use App\Http\Resources\DoctorSimpleResource;
use App\Models\User;
use Illuminate\Http\Request;

class AdminDoctorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $doctors = User::with('specialization')
            ->where('role', 'doctor')
            ->orderBy('last_name', 'asc')
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
        //
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
