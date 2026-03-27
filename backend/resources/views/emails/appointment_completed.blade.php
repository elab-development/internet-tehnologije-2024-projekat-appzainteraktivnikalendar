<x-mail::message>
# Pregled obavljen

Poštovani/a,

Vaš pregled kod doktora **{{ $doctorName }}** koji je bio zakazan za **{{ $startTime }}** je uspešno obavljen.

@if(!empty($note))
**Napomena doktora:**
> {{ $note }}
@endif

<x-mail::button :url="url('/appointments')">
Pogledajte Vaše termine
</x-mail::button>

Hvala na poverenju.  
Srdačno,  
Klinika {{ config('app.name') }}
</x-mail::message>
