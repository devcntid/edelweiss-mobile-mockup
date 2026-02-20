# Flow & Journey — Edelweiss Hospital Mobile Mockup

Dokumentasi lengkap alur (flow) dan perjalanan pengguna (user journey) dari awal hingga akhir untuk semua use case dalam aplikasi mockup Edelweiss Hospital.

---

## Daftar Isi

1. [Ringkasan View & Status](#1-ringkasan-view--status)
2. [Use Case: Browse Tanpa Login](#2-use-case-browse-tanpa-login)
3. [Use Case: Registrasi / Login dari Profil](#3-use-case-registrasi--login-dari-profil)
4. [Use Case: Registrasi / Login dari Booking](#4-use-case-registrasi--login-dari-booking)
5. [Use Case: Cari Dokter & Pilih Jadwal](#5-use-case-cari-dokter--pilih-jadwal)
6. [Use Case: Konfirmasi Booking (Existing vs New User)](#6-use-case-konfirmasi-booking-existing-vs-new-user)
7. [Use Case: Registrasi Pasien Baru (3 Step)](#7-use-case-registrasi-pasien-baru-3-step)
8. [Use Case: Booking Berhasil & E-Ticket](#8-use-case-booking-berhasil--e-ticket)
9. [Use Case: Tahapan Pemeriksaan (Nurse → Dokter → Lab → Tagihan)](#9-use-case-tahapan-pemeriksaan-nurse--dokter--lab--tagihan)
10. [Use Case: Tagihan & Pembayaran](#10-use-case-tagihan--pembayaran)
11. [Use Case: Setelah Pembayaran (Obat & Selesai)](#11-use-case-setelah-pembayaran-obat--selesai)
12. [Use Case: Riwayat Kunjungan & Detail Rekam Medis](#12-use-case-riwayat-kunjungan--detail-rekam-medis)
13. [Use Case: Hasil Lab](#13-use-case-hasil-lab)
14. [Use Case: Profil](#14-use-case-profil)
15. [Diagram Alur Utama](#15-diagram-alur-utama)

---

## 1. Ringkasan View & Status

| View | Deskripsi |
|------|-----------|
| `home` | Beranda: hero, card jadwal/tahapan/tagihan, widget cari, menu Riwayat Kunjungan / Hasil Lab, profil. |
| `search` | Hasil pencarian dokter: filter, daftar dokter + jadwal praktek (slot). |
| `booking` | Konfirmasi pesanan: ringkasan dokter & jadwal, pilih "booking untuk" (diri/keluarga), tombol Bayar. |
| `registration` | Registrasi pasien baru: Step 1 OTP, Step 2 Data Pribadi, Step 3 Profil Keluarga (opsional). |
| `success` | Halaman setelah booking berhasil: E-Ticket (Kode Booking + QR), detail dokter & jadwal. |
| `ticket_detail` | E-Ticket (sama seperti success, bisa dibuka dari card di home). |
| `billing` | Kasir rawat jalan: rincian tagihan (konsultasi, tindakan, farmasi, admin), total, tombol ke pembayaran. |
| `payment` | Pilih metode pembayaran (kartu, e-wallet, dll.), timer, tombol Bayar. |
| `payment_success` | Konfirmasi pembayaran berhasil + pilihan ambil obat (Pickup / Kirim ke Rumah). |
| `medical_records` | Daftar Riwayat Kunjungan (filter periode). |
| `record_detail` | Detail satu kunjungan: diagnosa, saran, hasil, resep. |
| `lab_results` | Daftar hasil lab; bisa buka detail per hasil. |
| `profile` | Profil pengguna; akses ke Registrasi (jika belum login) atau pengaturan. |

**Status booking (untuk card di home):**

Urutan di RS: **Check-in APM (dapat antrian)** → **Nurse Station (pemeriksaan awal perawat)** → Pemeriksaan dokter → Lab (jika rujuk) → Kembali ke dokter → Tagihan.

- `confirmed` → Booking dikonfirmasi. Caption: silakan check-in di APM untuk dapat antrian, lalu ke Nurse Station untuk pemeriksaan awal.
- `nurse_station` → Pemeriksaan awal oleh perawat (tensi & data vital); lalu tunggu panggilan ke ruang dokter.
- `doctor_exam` → Pemeriksaan dokter; jika ada rujukan lab, diarahkan ke lab.
- `lab_exam` → Lab selesai; kembali ke ruang dokter dengan hasil.
- `doctor_exam_2` → Pemeriksaan lanjutan; selesai → Kasir (pembayaran) → farmasi jika ada resep.
- `post_exam` → Muncul tagihan (card merah) → navigasi ke billing.

---

## 2. Use Case: Browse Tanpa Login

**Goal:** Pengguna membuka aplikasi dan melihat beranda serta bisa mencari dokter tanpa harus login.

**Flow:**

1. **Home**  
   - Buka aplikasi → view `home`.  
   - Melihat hero "Sehat lebih mudah", widget pencarian (Lokasi RS, Tanggal, Spesialisasi), dan menu bawah (Riwayat Kunjungan, Hasil Lab, Profil).  
   - Jika belum login, tidak ada card "Jadwal Mendatang".

2. **Cari dokter**  
   - Isi: Lokasi (atau "Semua Rumah Sakit"), Tanggal, Spesialisasi.  
   - Klik Cari Jadwal → view `search`.  
   - Melihat daftar dokter dengan jadwal praktek (slot: Pagi/Siang, status Tersedia / Hampir Penuh / Waiting List).

3. **Pilih slot (tanpa login)**  
   - Klik salah satu slot jadwal pada kartu dokter.  
   - Muncul **modal "Lanjutkan sebagai?"**:  
     - **Simulasi Existing User** → set logged in, pilih dokter & jadwal, ke view `booking`.  
     - **Simulasi New User** → set konteks pasien baru, pilih dokter & jadwal, ke view `registration` (3 step).  
   - Jika memilih Existing User → lanjut ke [Use Case: Konfirmasi Booking (Existing)](#6-use-case-konfirmasi-booking-existing-vs-new-user).  
   - Jika memilih New User → lanjut ke [Use Case: Registrasi Pasien Baru](#7-use-case-registrasi-pasien-baru-3-step), lalu kembali ke booking.

**Journey:** Home → (isi form) → Search → pilih slot → Modal Existing/New → Booking atau Registration.

---

## 3. Use Case: Registrasi / Login dari Profil

**Goal:** Pengguna membuka Profil dan memilih untuk registrasi (dianggap sebagai "login" untuk mockup).

**Flow:**

1. **Home** → Klik menu **Profil** (ikon orang) → view `profile`.

2. **Profil**  
   - Jika belum login: tampil opsi **Daftar / Login** (atau setara).  
   - Klik **Daftar / Login** → set `registrationFromProfile = true`, view `registration`.

3. **Registrasi (3 step)**  
   - Step 1: Verifikasi No. HP (OTP) → kirim OTP (simulasi) → verifikasi.  
   - Step 2: Data Pribadi (nama, NIK, TTL, gender, alamat).  
   - Step 3: Profil Anggota Keluarga (opsional): tambah/ubah anggota.  
   - Klik **Selesai Registrasi & Ke Beranda** → set user profile, `isLoggedIn = true`, view `home`.

**Journey:** Home → Profile → Daftar/Login → Registration (Step 1 → 2 → 3) → Home.

---

## 4. Use Case: Registrasi / Login dari Booking

**Goal:** Pengguna memilih slot dokter saat belum login, memilih "New User", lalu melalui registrasi 3 step dan kembali ke konfirmasi booking.

**Flow:**

1. **Search** → Pilih dokter & slot → Modal **"Lanjutkan sebagai?"** → Pilih **Simulasi New User**.

2. **Registration**  
   - `registrationFromProfile = false`, `selectedDoctor` & `selectedSchedule` tetap tersimpan.  
   - Step 1: OTP → Step 2: Data Pribadi → Step 3: Profil Keluarga.  
   - Klik **Selesai Registrasi & Lanjut Pilih Pasien** → set `bookingFor`, `isLoggedIn = true`, view `booking`.

3. **Booking**  
   - Di halaman Konfirmasi Pesanan, pengguna memilih "booking untuk" (diri sendiri atau anggota keluarga yang sudah ditambah).  
   - Bayar (simulasi) → view `success`.

**Journey:** Search → Pilih slot → New User → Registration (1→2→3) → Booking → pilih pasien → Bayar → Success.

---

## 5. Use Case: Cari Dokter & Pilih Jadwal

**Goal:** Pengguna sudah di beranda (atau setelah login) ingin cari dokter dan pilih jadwal.

**Flow:**

1. **Home**  
   - Isi widget: **Lokasi/Rumah Sakit**, **Tanggal**, **Spesialisasi**.  
   - Klik **Cari Jadwal** → view `search`.

2. **Search**  
   - Daftar dokter sesuai filter (spesialisasi, tanggal, lokasi).  
   - Setiap kartu dokter menampilkan: nama, spesialisasi, RS, rating, pengalaman, dan **jadwal praktek** (slot waktu dengan status: Tersedia / Hampir Penuh / Waiting List).  
   - Filter tambahan (opsional): modal Filter → Waktu Praktek (Pagi/Siang/Malam), Gender, Urutkan.  
   - Klik **satu slot** pada kartu dokter:  
     - Jika **sudah login** → langsung `setView('booking')` dengan dokter & jadwal terpilih.  
     - Jika **belum login** → modal Existing vs New User → lanjut seperti [Use Case 2/4](#4-use-case-registrasi--login-dari-booking).

**Journey:** Home → (form) → Search → (filter opsional) → Pilih slot → Booking atau Modal → Registration/Booking.

---

## 6. Use Case: Konfirmasi Booking (Existing vs New User)

**Goal:** Pengguna memastikan data booking dan memilih untuk siapa booking, lalu menyelesaikan pesanan.

**Flow:**

1. **View `booking`**  
   - Header: Konfirmasi Pesanan.  
   - Ringkasan: dokter, spesialisasi, tanggal, jam (dari `selectedDoctor`, `selectedSchedule`, `searchParams`).  
   - **Booking untuk:** dropdown/picker pasien (diri sendiri atau anggota keluarga dari `familyMembers`).  
   - Jika New User baru selesai registrasi, `bookingFor` sudah terisi; bisa diganti.

2. **Bayar**  
   - Klik **Bayar** (atau tombol setara) → simulasi loading (mis. 1,5 detik) → create `activeBooking` dengan `status: 'confirmed'`, `bookingCode`, `queueNo`, dll. → view `success`.

**Journey:** Booking (pilih pasien) → Bayar → Success (E-Ticket).

---

## 7. Use Case: Registrasi Pasien Baru (3 Step)

**Goal:** Melengkapi verifikasi dan data pasien baru sebelum bisa booking.

**Flow:**

1. **Masuk ke Registration**  
   - Dari **Profil** (registrationFromProfile = true) atau dari **Pilih slot** sebagai New User (registrationFromProfile = false).  
   - View `registration`, progress bar 3 step.

2. **Step 1: Verifikasi No. HP (OTP)**  
   - Input no. handphone.  
   - Klik **Kirim OTP** → simulasi `otpSent = true`.  
   - Input kode OTP → Klik **Verifikasi** → `otpVerified = true`.  
   - Tombol **Lanjut** aktif setelah OTP terverifikasi.

3. **Step 2: Data Pribadi Pasien**  
   - Nama Lengkap, NIK, Tanggal Lahir, Jenis Kelamin, Alamat Domisili.  
   - Validasi minimal (nama, no. HP).  
   - **Lanjut** → Step 3.

4. **Step 3: Profil Anggota Keluarga (Opsional)**  
   - Daftar anggota keluarga (mock); bisa Tambah / Ubah (modal).  
   - **Selesai Registrasi** →  
     - Jika dari profil → `setView('home')`.  
     - Jika dari booking → `setView('booking')` dengan `bookingFor` terisi pasien baru.

**Journey:** Registration → Step 1 (OTP) → Step 2 (Data) → Step 3 (Keluarga) → Home atau Booking.

---

## 8. Use Case: Booking Berhasil & E-Ticket

**Goal:** Setelah bayar, pengguna melihat tiket dan bisa membukanya lagi dari beranda.

**Flow:**

1. **View `success`**  
   - Tampil setelah konfirmasi booking.  
   - Judul: "Booking Berhasil!"  
   - Kartu E-Ticket: Kode Booking + QR, detail dokter & jadwal.  
   - Instruksi singkat: check-in di APM untuk dapat antrian, lalu ke Nurse Station untuk pemeriksaan awal.  
   - Tombol: **Ke Beranda** → view `home`.

2. **View `ticket_detail` (E-Ticket)**  
   - Dibuka dari card "Jadwal Mendatang" di home.  
   - Konten sama: Kode Booking + QR, wayfinding (APM → antrian → Nurse Station).  
   - Tombol back → `home`.

**Journey:** Success → (simpan/buka E-Ticket) → Home; atau Home → klik card → Ticket Detail → Back → Home.

---

## 9. Use Case: Tahapan Pemeriksaan (APM → Nurse → Dokter → Lab → Tagihan)

**Goal:** Simulasi perjalanan pasien dari booking sampai selesai diperiksa dan dapat tagihan.

**Urutan di rumah sakit:**  
1) **Check-in APM** → dapat nomor antrian  
2) **Nurse Station** → pemeriksaan awal oleh perawat (tensi & data vital)  
3) **Pemeriksaan dokter** (pertama)  
4) **Lab** (jika dirujuk)  
5) **Kembali ke dokter** (lanjutan)  
6) **Tagihan** → pembayaran → farmasi (jika ada resep)

**Status berurutan:** `confirmed` → `nurse_station` → `doctor_exam` → `lab_exam` → `doctor_exam_2` → `post_exam`.

**Flow & caption per card (singkat, informatif):**

1. **Confirmed**  
   - Card: **Booking Dikonfirmasi** (biru), QR + Kode Booking, dokter, tanggal, jam, countdown.  
   - **Caption:** Silakan check-in di APM untuk dapat nomor antrian, lalu ke Nurse Station untuk pemeriksaan awal.  
   - Tombol: **Simulasi Selesai di Nurse Station** → `nurse_station`.

2. **Nurse Station**  
   - Card: tema hijau/teal, "Tahap: Nurse Station (Pemeriksaan Awal)".  
   - **Caption:** Pemeriksaan awal oleh perawat (tensi & data vital). Setelah selesai, tunggu panggilan ke ruang dokter.  
   - Tombol: **Simulasi Pemeriksaan Dokter** → `doctor_exam`.

3. **Doctor Exam**  
   - Card: tema biru (dokter).  
   - **Caption:** Pemeriksaan dokter. Jika ada rujukan lab, Anda akan diarahkan ke lab.  
   - Tombol: **Simulasi Pemeriksaan Lab** → `lab_exam`.

4. **Lab Exam**  
   - Card: tema ungu (lab).  
   - **Caption:** Lab selesai. Kembali ke ruang dokter dengan hasil; tunggu panggilan antrian.  
   - Tombol: **Simulasi Kembali ke Pemeriksaan Dokter** → `doctor_exam_2`.

5. **Doctor Exam 2**  
   - Card: tema amber/orange (pemeriksaan lanjutan).  
   - **Caption:** Pemeriksaan lanjutan. Setelah selesai → ke Kasir untuk pembayaran, lalu farmasi jika ada resep.  
   - Tombol: **Simulasi Selesai Diperiksa → Tagihan** → `post_exam`, view → billing.

6. **Post Exam (Tagihan)**  
   - Card merah "Tagihan Pemeriksaan", total tagihan, "Menunggu Pembayaran".  
   - Klik card → view `billing`.

**Journey:** Home (Confirmed) → [Simulasi] → Nurse Station → Doctor → Lab → Doctor 2 → Tagihan → Billing.

---

## 10. Use Case: Tagihan & Pembayaran

**Goal:** Melunasi tagihan rawat jalan setelah pemeriksaan selesai.

**Flow:**

1. **Billing**  
   - Masuk dari: klik card "Tagihan Pemeriksaan" di home (status `post_exam`) atau otomatis setelah simulasi "Selesai Diperiksa → Tagihan".  
   - View `billing`: rincian (Konsultasi Dokter, Tindakan Medis, Instalasi Farmasi, Biaya Administrasi), Total Pembayaran.  
   - Tombol: **Pilih Metode Pembayaran** → view `payment`.

2. **Payment**  
   - Pilih metode (kartu kredit, e-wallet, dll.), timer countdown.  
   - Klik **Bayar** → simulasi proses (mis. 2 detik) → view `payment_success`.

**Journey:** Billing → Payment → (Bayar) → Payment Success.

---

## 11. Use Case: Setelah Pembayaran (Obat & Selesai)

**Goal:** Konfirmasi pembayaran dan pilihan pengambilan obat.

**Flow:**

1. **Payment Success**  
   - View `payment_success`: konfirmasi pembayaran berhasil.  
   - Pilihan **Ambil obat**:  
     - **Ambil di Lokasi (Pickup)** → konten: lokasi Farmasi Rawat Jalan, Lantai 1 Wing A.  
     - **Kirim ke Rumah** → konten: alamat terdaftar, info kurir.  
   - Tombol: **Selesai & Lihat Riwayat Kunjungan** → `handleFinishProcess()`: menambah rekam medis simulasi ke riwayat, `activeBooking = null`, view `home`.

**Journey:** Payment Success → Pilih Pickup/Delivery → Selesai → Home (tanpa card jadwal lagi).

---

## 12. Use Case: Riwayat Kunjungan & Detail Rekam Medis

**Goal:** Melihat daftar kunjungan dan detail rekam medis per kunjungan.

**Flow:**

1. **Home** → Klik **Riwayat Kunjungan** (atau menu setara) → view `medical_records`.

2. **Medical Records**  
   - Daftar riwayat (mock: dari `MEDICAL_RECORDS['self']`), filter periode (7 hari, 30 hari, 3 bulan, 1 tahun).  
   - Setiap item: tanggal, tipe (Rawat Jalan), judul/konsultasi, dokter, RS, status.  
   - Klik satu item → `handleOpenRecordDetail(record)` → view `record_detail`.

3. **Record Detail**  
   - Detail satu kunjungan: diagnosa, saran dokter, hasil pemeriksaan, resep (nama obat, dosis, aturan).  
   - Tombol back → view `medical_records`.

**Journey:** Home → Medical Records → (filter) → pilih kunjungan → Record Detail → Back → Medical Records.

---

## 13. Use Case: Hasil Lab

**Goal:** Melihat daftar hasil lab dan detail per hasil.

**Flow:**

1. **Home** → Klik **Hasil Lab** → view `lab_results`.

2. **Lab Results**  
   - Daftar hasil lab (mock).  
   - Klik satu hasil → set `selectedLabResult`, tampil detail (bisa dalam modal atau view terpisah).  
   - Kembali → daftar hasil lab.

**Journey:** Home → Lab Results → pilih hasil → Detail → Back.

---

## 14. Use Case: Profil

**Goal:** Mengakses profil dan (jika belum login) daftar/login.

**Flow:**

1. **Home** → Klik **Profil** → view `profile`.

2. **Profile**  
   - Jika belum login: opsi Daftar/Login → [Use Case: Registrasi dari Profil](#3-use-case-registrasi--login-dari-profil).  
   - Jika sudah login: tampil info profil (nama, no. HP, dll.) dan opsi pengaturan (jika ada di mockup).

**Journey:** Home → Profile → (Daftar/Login → Registration → Home) atau melihat info profil.

---

## 15. Diagram Alur Utama

```
                    +----------+
                    |   HOME   |
                    +----+-----+
                         |
         +---------------+---------------+------------------+
         |               |               |                    |
         v               v               v                    v
   [Cari Jadwal]   [Profil]    [Riwayat Kunjungan]   [Hasil Lab]   [Card Jadwal/Tagihan]
         |               |               |                    |              |
         v               v               v                    v              v
    +--------+    +-------------+   +----------------+   +-----------+   +-------------+
    | SEARCH |    | REGISTRATION|   | MEDICAL_RECORDS|   | LAB_RESULTS|   | TICKET_DETAIL|
    +---+----+    | (from profile)   +-------+--------+   +------+----+   | or BILLING  |
         |        +------+------+           |                   |         +-------------+
         |               |                  v                   v
         |               v           +-------------+     (detail)
         |          [HOME]           | RECORD_DETAIL|
         |                           +--------------+
         v
   [Pilih slot]
         |
    +----+----+
    | Existing | --> BOOKING --> Bayar --> SUCCESS --> HOME (card confirmed)
    | New User | --> REGISTRATION (1→2→3) --> BOOKING --> ... 
    +----------+

    HOME (card) --> Simulasi tahap --> nurse_station --> doctor_exam --> lab_exam --> doctor_exam_2 --> post_exam
                                                                                                          |
                                                                                                          v
    HOME (card Tagihan) --> BILLING --> PAYMENT --> PAYMENT_SUCCESS --> [Pickup/Delivery] --> Selesai --> HOME
```

---

## Checklist Use Case (Tidak Ada yang Terlewat)

- [x] Browse tanpa login (home, search, lihat dokter & slot).
- [x] Login/Registrasi dari Profil → Registrasi 3 step → Home.
- [x] Login/Registrasi dari Booking (pilih slot → New User → Registrasi 3 step → Booking).
- [x] Cari dokter & pilih jadwal (form home → search → filter → pilih slot).
- [x] Konfirmasi booking: pilih pasien, Bayar → Success.
- [x] Registrasi pasien baru: Step 1 OTP, Step 2 Data Pribadi, Step 3 Profil Keluarga.
- [x] Booking berhasil & E-Ticket (Kode Booking + QR dummy), wayfinding APM.
- [x] Buka E-Ticket dari home (ticket_detail).
- [x] Tahapan pemeriksaan: confirmed (caption: check-in APM → antrian → Nurse Station) → nurse_station (pemeriksaan awal perawat) → doctor_exam → lab_exam → doctor_exam_2 → post_exam; desain card berbeda per tahap, caption singkat & informatif, QR di setiap card.
- [x] Tagihan (card merah) → Billing → Payment → Payment Success.
- [x] Setelah pembayaran: pilih Pickup / Kirim ke Rumah → Selesai → Home, riwayat bertambah.
- [x] Riwayat Kunjungan → daftar → detail rekam medis.
- [x] Hasil Lab → daftar → detail hasil.
- [x] Profil (dan akses registrasi jika belum login).

---

*Dokumen ini mencakup semua flow dan journey yang ada di mockup Edelweiss Hospital (file `App.jsx`).*
