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
   APP_NAME=Sinergija Zdravlja
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

   MAIL_MAILER=smtp
   MAIL_HOST=smtp.example.com
   MAIL_PORT=587
   MAIL_USERNAME=your_email@example.com
   MAIL_PASSWORD=your_password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=your_email@example.com
   MAIL_FROM_NAME=${APP_NAME}

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

* 👨‍⚕️ **Administratori** – upravljaju lekarima i njihovim radnim vremenom.
* 🩺 **Lekari** – pregledaju i ažuriraju svoje zakazane termine, sa mogućnosti da odbiju termin ili dodaju napomenu.
* 👩‍💻 **Pacijenti** – imaju pristup ličnom interaktivnom kalendaru na kom mogu da zakazuju, otkazuju ili menjaju termine.
* 🔔 **Notifikacije** – pacijenti dobijaju obaveštenja o otkazanim terminima ili napomenama doktora o njihovom zdravlju.
* 📅 Preuzimanje termina – pacijenti mogu da preuzmu svoje zakazane termine u .ics formatu i dodaju ih u lični kalendar (Google Calendar, Outlook itd.).
