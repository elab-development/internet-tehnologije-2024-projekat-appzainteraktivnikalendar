<x-mail::message>
# Resetovanje lozinke

Poštovani/a,

Primili smo zahtev za resetovanje lozinke za Vaš nalog.

Kliknite na dugme ispod da postavite novu lozinku:

<x-mail::button :url="$resetUrl">
Resetujte lozinku
</x-mail::button>

Ako niste Vi poslali ovaj zahtev, možete slobodno ignorisati ovu poruku.

Hvala na poverenju,  
Srdačno,  
{{ config('app.name') }}
</x-mail::message>
