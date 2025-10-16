<?php

namespace App\Http\Controllers;

use App\Models\Specialization;
use Illuminate\Http\Request;

class SpecializationController extends Controller
{
    public function getSpecializations()
{
    $specializations = Specialization::select('id', 'name', 'color')->get();

    return response()->json([
        'specializations' => $specializations
    ]);
}
}
