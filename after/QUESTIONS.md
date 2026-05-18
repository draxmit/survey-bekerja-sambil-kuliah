# Question Set — `after/` (live release)

Slim version of the survey. Compared to `before/`:

- Identity questions (Nama, Email Binus, NIM) **removed** — submissions are anonymous
- Old A4 / A5 (screening) renumbered to **A1 / A2**
- `[PRESURVEY ONLY] FEEDBACK SURVEY` section **removed**
- C4 scale labels **flipped** (now `1 — Sangat tidak berkaitan` ↔ `5 — Sangat berkaitan`)
- Question titles drop the `Xn.` prefix on the user side; section headers (A, B, C…) still shown
- Internal item IDs and sheet column codes **preserved** (just renumbered for the A section)

22 user-facing questions across 6 wizard steps.

---

## A. Seleksi Kriteria

| ID | Type | Question | Options | Required |
|----|------|----------|---------|:---:|
| **A1** | MC | Apakah Anda saat ini merupakan mahasiswa aktif Universitas Bina Nusantara yang sedang menjalani pendidikan S1? | `Ya` / `Tidak` — `Tidak` = screen-out | ✅ |
| **A2** | MC | Apakah Anda saat ini bekerja dalam bentuk apa pun sembari kuliah? *(Termasuk pekerjaan penuh waktu, paruh waktu, freelance/gig, magang berbayar, atau menjalankan bisnis sendiri.)* | `Ya` / `Tidak` — `Tidak` = screen-out | ✅ |

---

## B. Latar Belakang Demografis & Akademik

| ID | Type | Question | Options / Validation | Required |
|----|------|----------|----------------------|:---:|
| **B1** | MC + Lainnya | Apa Fakultas Anda di Universitas Bina Nusantara? | 8 faculties (see below) + `Lainnya:` | ✅ |
| **B2** | LIST (combobox) | Apa Jurusan Anda di Universitas Bina Nusantara? | Filtered by B1, with "Semua Jurusan" toggle. Last option always `TIDAK ADA DI DAFTAR`. | ✅ |
| **B3** | TEXT | Anda saat ini berada di semester berapa? | Integer 1–14 | ✅ |
| **B4** | TEXT | Berapa IPK terbaru/terakhir Anda? | Regex `^[0-4](\.\d{1,2})?$`, range 0.00–4.00 | ✅ |
| **B5** | TEXT | Berapa IPK Anda sebelum mulai bekerja? *(Jika sudah bekerja sebelum masuk Binus, masukkan IPK Semester 1.)* | Same as B4 | ✅ |

### B1 Faculties (8) → B2 Jurusan filter

| Faculty | Jurusan |
|---|---|
| **School of Computer Science (SOCS)** | Artificial Intelligence · Computer Science · Computer Science & Mathematics · Computer Science & Statistics · Cyber Security · Data Science · Game Application & Technology · Software Engineering Program |
| **School of Information Systems (SOIS)** | Business Analytics · Business Information Tech · Digital Business Innovation · Digital Tech in Marine Science · Digital Technology in Fishery · Information Systems |
| **School of Design (SOD)** | Animation · Creative Advertising · Fashion · Film · Interior Design · New Media · Visual Communication Design |
| **School of Accounting (SOA)** | Accounting · Finance · Taxation |
| **Faculty of Digital Communication and Hotel & Tourism (FDCHT)** | Business Hotel Management · Creative Communication · Digital Media Communication · Event & Travel Business · Hotel Management · Marketing Communication |
| **Faculty of Humanities (FOH)** | Business Law · Creative Digital English · Digital Psychology · Global Business Chinese · International Relations · Japanese Popular Culture · Primary Teacher Education · Psychology |
| **Binus Business School (BBS)** | Business Creation · Business Management · Digital Business · Global Business Marketing · International Business · Management |
| **Faculty of Engineering (FE)** | Architecture · Biotechnology · Civil Engineering · Computer Engineering · Food Technology · Industrial Engineering · Professional Engineer Program |
| *Always in dropdown* | `TIDAK ADA DI DAFTAR` (reveals free-text input) |

---

## C. Profil Pekerjaan

| ID | Type | Question | Options / Validation | Required |
|----|------|----------|----------------------|:---:|
| **C1** | MC + Lainnya | Apa yang paling tepat menggambarkan jenis pekerjaan utama Anda saat ini? | 5 fixed + `Lainnya:` | ✅ |
| **C2** | MC | Rata-rata, berapa jam per minggu yang Anda habiskan untuk bekerja selama minggu perkuliahan yang normal? | `Kurang dari 10 jam` / `10–19 jam` / `20–29 jam` / `30–39 jam` / `40 jam atau lebih` | ✅ |
| **C3** | MC + numeric | Sejak semester berapa perkuliahan Anda, Anda mulai bekerja? | `Sudah bekerja sebelum masuk Binus` **OR** `Sejak semester ke-…` (numeric input 1–14, must not exceed B3) | ✅ |
| **C4** | SCALE 1–5 | Dari skala 1-5, seberapa pekerjaan Anda saat ini berkaitan langsung dengan bidang studi Anda di Binus? | `1 — Sangat tidak berkaitan` ↔ `5 — Sangat berkaitan` *(flipped vs `before/`)* | ✅ |

### C1 Choices

1. Karyawan penuh waktu (≥35 jam/minggu, dengan pemberi kerja tetap)
2. Karyawan paruh waktu (<35 jam/minggu, dengan pemberi kerja tetap)
3. Freelancer / Pekerja gig (berbasis proyek, tanpa pemberi kerja tetap)
4. Wirausaha / Pemilik bisnis sendiri
5. Magang berbayar / Pekerja kontrak
6. Lainnya (free-text)

---

## D. Indikator Performa Akademik

| ID | Type | Question | Options | Required |
|----|------|----------|---------|:---:|
| **D1** | MC | Menurut Anda, bagaimana dampak pekerjaan Anda terhadap IPK Anda? | 5 options (see below) | ✅ |
| **D2** | MC | Dalam satu bulan terakhir, berapa kali Anda tidak hadir di kelas tatap muka karena kewajiban pekerjaan? | `Tidak pernah (0 sesi)` / `1–2 sesi` / `3–5 sesi` / `6–10 sesi` / `Lebih dari 10 sesi` | ✅ |
| **D3** | MC | Dalam satu bulan terakhir, berapa kali Anda tidak mengikuti kelas online/virtual karena kewajiban pekerjaan? | Same as D2 | ✅ |
| **D4** | SCALE 1–5 | Seberapa sering Anda mengumpulkan tugas terlambat atau di bawah standar kualitas yang Anda inginkan akibat kewajiban pekerjaan? | `1 — Tidak Pernah` ↔ `5 — Sangat Sering / Selalu` | ✅ |

### D1 Choices

1. Menurun Signifikan
2. Menurun Sedikit
3. Tidak Berubah Secara Berarti
4. Meningkat Sedikit
5. Meningkat Signifikan

---

## E. Stress, Burnout & Manajemen Waktu

| ID | Type | Question | Left ↔ Right | Required |
|----|------|----------|---------------|:---:|
| **E1** | SCALE 1–5 | Bagaimana Anda menilai tingkat stres akademik Anda saat ini akibat menyeimbangkan pekerjaan dan perkuliahan? | `Tidak Stress Sama Sekali` ↔ `Stres ekstrem / Sangat berat` | ✅ |
| **E2** | SCALE 1–5 | Seberapa sering Anda mengalami kelelahan fisik atau mental (burnout) yang Anda kaitkan dengan kombinasi pekerjaan dan kuliah? | `Tidak pernah` ↔ `Hampir selalu / Setiap hari` | ✅ |
| **E3** | SCALE 1–5 | Bagaimana Anda menilai kemampuan Anda dalam mengatur waktu secara efektif antara pekerjaan dan tanggung jawab akademik? | `Sangat buruk` ↔ `Sangat baik` | ✅ |
| **E4** | SCALE 1–5 | Seberapa baik Anda memahami dan mengingat materi perkuliahan yang diajarkan di kelas yang Anda hadiri? | `Sangat tidak paham` ↔ `Sangat paham` | ✅ |
| **E5** | SCALE 1–5 | Seberapa sering jadwal kerja Anda berkonflik langsung dengan jadwal kuliah atau persiapan ujian Anda? | `Tidak pernah` ↔ `Sangat sering / Selalu` | ✅ |

---

## F. Persepsi Dampak & Refleksi Terbuka

| ID | Type | Question | Options | Required |
|----|------|----------|---------|:---:|
| **F1** | MC | Secara keseluruhan, menurut Anda apakah bekerja sambil kuliah memberikan dampak positif atau negatif secara neto terhadap performa akademik Anda? | 5 options (see below) | ✅ |
| **F2** | PARAGRAPH | Apa tantangan terbesar yang Anda hadapi dalam menyeimbangkan pekerjaan dan tanggung jawab akademik? | Free text, max 2000 chars | ❌ optional |

### F1 Choices

1. Sangat positif, bekerja sangat membantu akademik saya
2. Cukup positif, bekerja sedikit menguntungkan akademik saya
3. Netral, tidak ada dampak yang berarti
4. Cukup negatif, bekerja sedikit merugikan akademik saya
5. Sangat negatif, bekerja sangat merugikan akademik saya

---

## Sheet schema (32 columns)

```
[meta]    submissionID, serverTimestamp, clientStartTime, clientSubmitTime, totalSeconds, userAgent
[A]       A1_AktifS1, A2_Bekerja
[B]       B1_Fakultas, B1_Lainnya, B2_Jurusan, B2_Lainnya, B3_Semester, B4_IPK_Terbaru, B5_IPK_PreKerja
[C]       C1_JenisPekerjaan, C1_Lainnya, C2_JamPerMinggu, C3_SemesterMulaiKerja, C4_RelasiPekerjaan_1to5
[D]       D1_PerubahanIPK, D2_AbsenOffline, D3_AbsenOnline, D4_TugasTerlambat_1to5
[E]       E1_Stress_1to5, E2_Burnout_1to5, E3_ManajemenWaktu_1to5, E4_PemahamanMateri_1to5, E5_KonflikJadwal_1to5
[F]       F1_PersepsiDampak, F2_TantanganTerbesar
```

`C3_SemesterMulaiKerja` stores either `"Sudah bekerja sebelum masuk Binus"` or `"Semester N"`.

---

## Summary

- **22 user-facing questions** across **6 wizard steps** (A → F): A(2) + B(5) + C(4) + D(4) + E(5) + F(2)
- **Question types**: MC (8 incl. 3 with `Lainnya`/custom-other), LIST (1), TEXT (3), PARAGRAPH (1), SCALE 1–5 (7)
- **Cross-field rules**: A1/A2 screening, GPA range 0–4, semester range 1–14, C3 ≤ B3, untouched SCALE blocked
- **32-column** Google Sheet response schema (6 meta + 2 A + 7 B + 5 C + 4 D + 5 E + 2 F)
- **Anonymous**: no Nama/Email/NIM collected
