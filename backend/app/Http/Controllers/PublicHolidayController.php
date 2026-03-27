<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PublicHolidayController extends Controller
{
    public function index()
    {
        $year = now()->year;
        $countryCode = 'RS'; // Srbija
        $url = "https://date.nager.at/api/v3/PublicHolidays/{$year}/{$countryCode}";

        $response = Http::get($url);

        if ($response->failed()) {
            return response()->json(['error' => 'Neuspešno preuzimanje praznika.'], 500);
        }

        // samo najvažniji podaci
        $holidays = collect($response->json())->map(function ($holiday) {
            return [
                'date' => $holiday['date'],
                'localName' => $holiday['localName'],
                'name' => $holiday['name'],
            ];
        });

        return response()->json($holidays);
    }
}
