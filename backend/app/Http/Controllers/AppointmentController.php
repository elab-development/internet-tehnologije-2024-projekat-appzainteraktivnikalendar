<?php

namespace App\Http\Controllers;

use App\Http\Resources\DoctorAppointmentResource;
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

        // 1. Upit za termine pacijenta — samo scheduled i completed
        $query = Appointment::with('doctor.specialization')
            ->where('patient_id', $user->id)
            ->whereIn('status', ['scheduled', 'completed'])
            ->orderBy('start_time', 'asc');

        // 2. Filtriranje po jednoj ili više specijalnosti (SK4)
        if ($request->filled('specialization_ids')) {
            $query->whereHas('doctor.specialization', function ($q) use ($request) {
                $q->whereIn('id', $request->specialization_ids);
            });
        }

        $appointments = $query->get();

        // 3. Vraćamo sve specijalnosti lekara (ne filtrirane)
        $specializations = Specialization::select('id', 'name', 'color')->get();

        // 4. Vraćamo sve zajedno
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

    public function getAvailableTimes($doctorId, Request $request)
    {
        $date = $request->query('date');
        if (!$date) {
            return response()->json(['message' => 'Date is required.'], 400);
        }
        // datum mora biti u budućnosti
        $requestedDate = Carbon::parse($date);
        if ($requestedDate->isPast()) {
            return response()->json(['message' => 'Date must be in the future.'], 400);
        }

        // Odredi koji je dan u nedelji (npr. Monday)
        $dayOfWeek = date('l', strtotime($date));

        // Nađi raspored rada doktora za taj dan
        $schedule = DoctorSchedule::where('doctor_id', $doctorId)
            ->where('day_of_week', $dayOfWeek)
            ->first();

        if (!$schedule) {
            return response()->json(['message' => 'Doctor does not work on this day.'], 404);
        }

        // Dohvati termine tog doktora za taj dan
        $appointments = Appointment::where('doctor_id', $doctorId)
            ->whereDate('start_time', $date)
            ->whereIn('status', ['scheduled', 'rejected'])
            ->get()
            ->map(fn($appt) => Carbon::parse($appt->start_time)->format('H:i'))
            ->toArray();

        // Generiši sve moguće termine na osnovu njegovog rasporeda
        $availableSlots = [];
        $current = strtotime($schedule->start_time);
        $end = strtotime($schedule->end_time);

        while ($current < $end) {
            $slot = date('H:i', $current);
            if (!in_array($slot, $appointments)) {
                $availableSlots[] = $slot;
            }
            $current = strtotime('+30 minutes', $current);
        }

        return response()->json([
            'doctor_id' => $doctorId,
            'date' => $date,
            'available_times' => $availableSlots,
        ]);
    }

    public function bookAppointment(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'start_time' => 'required|date_format:Y-m-d H:i',
        ]);

        $user = Auth::user();
        $doctorId = $request->doctor_id;
        $startTime = Carbon::parse($request->start_time);

        // 1. Proveri da li je datum u budućnosti
        if ($startTime->isPast()) {
            return response()->json(['message' => 'Cannot book an appointment in the past.'], 400);
        }

        // 2. Proveri da li doktor radi taj dan i u to vreme
        $dayOfWeek = $startTime->format('l');
        $schedule = DoctorSchedule::where('doctor_id', $doctorId)
            ->where('day_of_week', $dayOfWeek)
            ->first();

        if (!$schedule) {
            return response()->json(['message' => 'Doctor does not work on this day.'], 400);
        }

        $appointmentStartTime = $startTime->format('H:i');
        $appointmentEndTime = $startTime->copy()->addMinutes(30)->format('H:i');
        $startOfWork = Carbon::parse($schedule->start_time)->format('H:i');
        $endOfWork = Carbon::parse($schedule->end_time)->format('H:i');

        if ($appointmentStartTime < $startOfWork || $appointmentEndTime > $endOfWork) {
            return response()->json(['message' => 'Selected time is outside of doctor\'s working hours.'], 400);
        }

        // 3. Proveri da li termin već nije zakazan ili odbijen
        $exists = Appointment::where('doctor_id', $doctorId)
            ->where('start_time', $startTime)
            ->whereIn('status', ['scheduled', 'rejected'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Selected time is no longer available.'], 400);
        }

        // 4. Kreiraj termin
        $appointment = Appointment::create([
            'doctor_id' => $doctorId,
            'patient_id' => $user->id,
            'start_time' => $startTime,
            'end_time' => $startTime->copy()->addMinutes(30), // fiksno 30 min
            'status' => 'scheduled',
        ]);

        return response()->json([
            'message' => 'Appointment booked successfully.',
            'appointment' => new PatientAppointmentResource($appointment),
        ], 201);
    }

    public function updateAppointment(Request $request, $appointmentId)
    {
        $request->validate([
            'new_start_time' => 'required|date_format:Y-m-d H:i',
        ]);

        $user = Auth::user();
        $appointment = Appointment::where('id', $appointmentId)
            ->where('patient_id', $user->id)
            ->firstOrFail();

        $newStart = Carbon::parse($request->new_start_time);
        $doctorId = $appointment->doctor_id;

        // 1. Ne može menjati prošle termine
        if ($appointment->start_time < now()) {
            return response()->json(['message' => 'Cannot modify a past appointment.'], 400);
        }

        // 2. Ako je vreme isto kao pre — nema promene
        if ($newStart->equalTo(Carbon::parse($appointment->start_time))) {
            return response()->json(['message' => 'No changes detected.'], 400);
        }
        // 3. Samo zakazani termini mogu da se menjaju
        if ($appointment->status !== 'scheduled') {
            return response()->json(['message' => 'Only scheduled appointments can be modified.'], 400);
        }

        // 4. Termin mora biti u budućnosti
        if ($newStart->isPast()) {
            return response()->json(['message' => 'Cannot move appointment to the past.'], 400);
        }

        // 5. Provera radnog vremena doktora
        $dayOfWeek = $newStart->format('l');
        $schedule = DoctorSchedule::where('doctor_id', $doctorId)
            ->where('day_of_week', $dayOfWeek)
            ->first();

        if (!$schedule) {
            return response()->json(['message' => 'Doctor does not work on this day.'], 400);
        }

        $appointmentStartTime = $newStart->format('H:i');
        $appointmentEndTimeStr = $newStart->copy()->addMinutes(30)->format('H:i');
        $startOfWork = Carbon::parse($schedule->start_time)->format('H:i');
        $endOfWork = Carbon::parse($schedule->end_time)->format('H:i');

        if ($appointmentStartTime < $startOfWork || $appointmentEndTimeStr > $endOfWork) {
            return response()->json(['message' => 'Selected time is outside of doctor\'s working hours.'], 400);
        }

        // 5. Proveri da li je termin već zauzet
        $exists = Appointment::where('doctor_id', $doctorId)
            ->where('id', '!=', $appointment->id)
            ->where('start_time', $newStart)
            ->whereIn('status', ['scheduled', 'rejected'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Selected time is no longer available.'], 400);
        }

        // 6. Ažuriraj termin
        $appointment->update([
            'start_time' => $newStart,
            'end_time' => $newStart->copy()->addMinutes(30)
        ]);

        // 7. Vrati ažurirani termin kroz resource
        return new PatientAppointmentResource($appointment);
    }

    public function cancelAppointment($appointmentId)
    {
        $user = Auth::user();

        // 1. Pronađi termin koji pripada pacijentu
        $appointment = Appointment::where('id', $appointmentId)
            ->where('patient_id', $user->id)
            ->firstOrFail();

        $startTime = Carbon::parse($appointment->start_time);

        // 2. Proveri da li je termin već prošao
        if ($startTime->isPast()) {
            return response()->json(['message' => 'Cannot cancel a past appointment.'], 400);
        }

        // 3. Proveri status termina
        if ($appointment->status !== 'scheduled') {
            return response()->json(['message' => 'Only scheduled appointments can be cancelled.'], 400);
        }

        // 4. Ne može se otkazati ako je manje od 1h do termina
        if (now()->diffInMinutes($startTime) < 60) {
            return response()->json(['message' => 'Cannot cancel less than 1 hour before the appointment.'], 400);
        }

        // 5. Ažuriraj status termina
        $appointment->update([
            'status' => 'canceled',
        ]);

        // 6. Vrati JSON odgovor kroz resource
        return response()->json([
            'message' => 'Appointment cancelled successfully.',
            'appointment' => new PatientAppointmentResource($appointment),
        ], 200);
    }

    public function exportAppointments()
    {
        $user = Auth::user();

        // Učitavamo termine pacijenta samo sa statusom scheduled ili completed
        $appointments = Appointment::with('doctor.specialization')
            ->where('patient_id', $user->id)
            ->whereIn('status', ['scheduled', 'completed'])
            ->orderBy('start_time', 'asc')
            ->get();

        if ($appointments->isEmpty()) {
            return response()->json(['message' => 'No appointments to export.'], 404);
        }

        // Generišemo .ics sadržaj
        $icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//MyClinicApp//Appointments//EN\r\n";

        foreach ($appointments as $appointment) {
            $start = Carbon::parse($appointment->start_time)->format('Ymd\THis');
            $end = Carbon::parse($appointment->end_time)->format('Ymd\THis');
            $summary = "Appointment with Dr. {$appointment->doctor->first_name} {$appointment->doctor->last_name} ({$appointment->doctor->specialization->name})";
            $description = "Status: {$appointment->status}\\nNote: " . ($appointment->note ?? '');

            $icsContent .= "BEGIN:VEVENT\r\n";
            $icsContent .= "UID:appointment-{$appointment->id}@myclinicapp.local\r\n";
            $icsContent .= "DTSTAMP:" . now()->format('Ymd\THis') . "\r\n";
            $icsContent .= "DTSTART:{$start}\r\n";
            $icsContent .= "DTEND:{$end}\r\n";
            $icsContent .= "SUMMARY:{$summary}\r\n";
            $icsContent .= "DESCRIPTION:{$description}\r\n";
            $icsContent .= "END:VEVENT\r\n";
        }

        $icsContent .= "END:VCALENDAR\r\n";

        return response($icsContent, 200)
            ->header('Content-Type', 'text/calendar')
            ->header('Content-Disposition', 'attachment; filename="appointments.ics"');
    }

    public function getAppointmentHistory(Request $request)
    {
        $user = Auth::user();

        // Uzmi samo termine sa statusom 'completed' (prošli pregledi)
        $appointments = Appointment::with('doctor.specialization')
            ->where('patient_id', $user->id)
            ->where('status', 'completed')
            ->orderBy('start_time', 'desc')
            ->paginate(10); // 10 redova po strani

        // Ako nema rezultata, paginacija će vratiti praznu stranicu
        return PatientAppointmentResource::collection($appointments)
            ->additional([
                'message' => $appointments->count() ? 'History loaded successfully.' : 'No completed appointments found.'
            ]);
    }

    public function getDoctorAppointments()
    {
        $user = Auth::user();

        $appointments = Appointment::where('doctor_id', $user->id)
            ->whereIn('status', ['scheduled', 'completed'])
            ->with(['patient']) // učitamo celu pacijent relaciju
            ->orderBy('start_time', 'asc')
            ->get();

        return DoctorAppointmentResource::collection($appointments);
    }
}