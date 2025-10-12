<x-mail::message>
# Termin Odbijen 😔

Poštovani,

Nažalost, Vaš termin kod doktora **{{ $doctorName }}** zakazan za **{{ $startTime }}** je **odbijen**.

<x-mail::panel>
**Doktor:** {{ $doctorName }}
**Termin:** {{ $startTime }}
</x-mail::panel>

Molimo Vas da izaberete neki drugi termin.

<x-mail::button :url="url('/appointments')">
Izaberite Novi Termin
</x-mail::button>

Hvala na razumevanju.

S poštovanjem,  
Klinika {{ config('app.name') }}
</x-mail::message>