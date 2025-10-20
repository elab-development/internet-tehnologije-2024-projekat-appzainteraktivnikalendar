# 🏥 Interaktivni sistem za zakazivanje pregleda u klinici

Ovaj projekat predstavlja **web aplikaciju za upravljanje terminima, lekarima i pacijentima** u okviru jedne klinike.
Sistem omogućava administratorima da upravljaju korisnicima i specijalizacijama, lekarima da pregledaju i ažuriraju svoje termine,
dok pacijenti mogu da zakazuju i otkazuju preglede na jednostavan i pregledan način.

---

## ⚙️ Tehnologije

**Backend:** Laravel 11 (PHP framework)
**Frontend:** React (JavaScript biblioteka)
**Baza podataka:** MySQL (pomoću XAMPP-a)
**Autentifikacija:** Laravel Sanctum
**HTTP komunikacija:** Axios
**UI biblioteka:** React Bootstrap

---

## 🧩 Struktura projekta

```
/frontend
  ├── src/
  │   ├── components/
  │   ├── pages/
  │   ├── api/
  │   ├── styles/
  │   └── App.js
/backend
  ├── app/
  ├── routes/
  ├── database/
  ├── public/
  ├── .env
  └── artisan
```

Frontend deo aplikacije pokreće se na portu **3000**, dok se backend (Laravel) pokreće na portu **8000**.

---

## 🖥️ Pokretanje projekta lokalno

### 🔹 Backend (Laravel)

1. Pokrenuti **XAMPP** i omogućiti `Apache` i `MySQL`.

2. Napraviti novu bazu podataka (npr. `clinic_db`).

3. Klonirati repozitorijum i otvoriti backend folder:

   ```bash
   cd backend
   ```

4. Instalirati potrebne pakete:

   ```bash
   composer install
   ```

5. Napraviti `.env` fajl (ako ne postoji) i podesiti osnovne parametre:

   ```env
   APP_NAME=ClinicApp
   APP_ENV=local
   APP_KEY=
   APP_DEBUG=true
   APP_URL=http://localhost:8000

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=clinic_db
   DB_USERNAME=root
   DB_PASSWORD=

   SANCTUM_STATEFUL_DOMAINS=localhost:3000
   FRONTEND_URL=http://localhost:3000
   ```

6. Generisati aplikacioni ključ:

   ```bash
   php artisan key:generate
   ```

7. Pokrenuti migracije i inicijalne podatke:

   ```bash
   php artisan migrate --seed
   ```

8. Pokrenuti server:

   ```bash
   php artisan serve
   ```

---

### 🔹 Frontend (React)

1. Otvoriti frontend folder:

   ```bash
   cd frontend
   ```
2. Instalirati zavisnosti:

   ```bash
   npm install
   ```
3. Pokrenuti React aplikaciju:

   ```bash
   npm start
   ```

Aplikacija će biti dostupna na adresi 👉 **[http://localhost:3000](http://localhost:3000)**
Backend API: **[http://localhost:8000/api](http://localhost:8000/api)**

---

## 🧠 Funkcionalnosti sistema

* 👨‍⚕️ **Administratori** – upravljaju lekarima, specijalizacijama i korisnicima.
* 🩺 **Lekari** – pregledaju i ažuriraju svoje termine, definišu raspored po danima.
* 👩‍💻 **Pacijenti** – pretražuju lekare, zakazuju i otkazuju termine.
* 🔔 **Notifikacije** – korisnici dobijaju obaveštenja o terminima.
* 🕒 **Raspored rada** – sistem prikazuje dostupne dane i vreme rada lekara.
