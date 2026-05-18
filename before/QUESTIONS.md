# Question Set

Full survey question set with options.

---

## A. Seleksi Kriteria

| ID | Type | Question | Options / Validation | Required |
|----|------|----------|----------------------|:---:|
| **A1** | TEXT | Nama | Free text, min 1 char | ✅ |
| **A2** | TEXT | Email Binus | Regex `^[a-zA-Z0-9._%+-]+@binus\.ac\.id$` | ✅ |
| **A3** | TEXT | NIM | Regex `^(23\|24\|25\|26\|27\|28\|29)\d{8}$` (10 digits, year prefix 23–29) | ✅ |
| **A4** | MC | Apakah Anda saat ini merupakan mahasiswa aktif Universitas Bina Nusantara dengan pendidikan S1? | `Ya` / `Tidak` — `Tidak` = screen-out | ✅ |
| **A5** | MC | Apakah Anda saat ini bekerja dalam bentuk apa pun sembari kuliah? *(Termasuk pekerjaan penuh waktu, paruh waktu, freelance/gig, magang berbayar, atau menjalankan bisnis sendiri.)* | `Ya` / `Tidak` — `Tidak` = screen-out | ✅ |

---

## B. Latar Belakang Demografis & Akademik

| ID | Type | Question | Options / Validation | Required |
|----|------|----------|----------------------|:---:|
| **B1** | MC + Lainnya | Apa Fakultas Anda di Universitas Bina Nusantara? | 8 faculties (see below) + `Lainnya:` | ✅ |
| **B2** | LIST (combobox) | Apa Jurusan Anda di Universitas Bina Nusantara? | Filtered by B1, with "Semua Jurusan" toggle. Last option always `TIDAK ADA DI DAFTAR` (reveals free-text input). | ✅ |
| **B3** | TEXT | Anda saat ini berada di semester berapa? | Integer 1–14 | ✅ |
| **B4** | TEXT | Berapa IPK terbaru/terakhir Anda? | Regex `^[0-4](\.\d{1,2})?$`, range 0.00–4.00 | ✅ |
| **B5** | TEXT | Berapa IPK Anda sebelum mulai bekerja? *(Jika sudah bekerja sebelum masuk Binus, masukkan IPK Semester 1.)* | Same as B4 | ✅ |

### B1 Faculties (8) → B2 Jurusan filter

| Faculty | Jurusan (when this fakultas is picked) |
|---|---|
| **School of Computer Science (SOCS)** | Artificial Intelligence · Computer Science · Computer Science & Mathematics · Computer Science & Statistics · Cyber Security · Data Science · Game Application & Technology · Software Engineering Program |
| **School of Information Systems (SOIS)** | Business Analytics · Business Information Tech · Digital Business Innovation · Digital Tech in Marine Science · Digital Technology in Fishery · Information Systems |
| **School of Design (SOD)** | Animation · Creative Advertising · Fashion · Film · Interior Design · New Media · Visual Communication Design |
| **School of Accounting (SOA)** | Accounting · Finance · Taxation |
| **Faculty of Digital Communication and Hotel & Tourism (FDCHT)** | Business Hotel Management · Creative Communication · Digital Media Communication · Event & Travel Business · Hotel Management · Marketing Communication |
| **Faculty of Humanities (FOH)** | Business Law · Creative Digital English · Digital Psychology · Global Business Chinese · International Relations · Japanese Popular Culture · Primary Teacher Education · Psychology |
| **Binus Business School (BBS)** | Business Creation · Business Management · Digital Business · Global Business Marketing · International Business · Management |
| **Faculty of Engineering (FE)** | Architecture · Biotechnology · Civil Engineering · Computer Engineering · Food Technology · Industrial Engineering · Professional Engineer Program |
| *Always in dropdown* | `TIDAK ADA DI DAFTAR` (reveals free-text "ketik nama jurusan" input) |

---

## C. Profil Pekerjaan

| ID | Type | Question | Options / Validation | Required |
|----|------|----------|----------------------|:---:|
| **C1** | MC + Lainnya | Apa yang paling tepat menggambarkan jenis pekerjaan utama Anda saat ini? | 5 fixed + `Lainnya:` (see below) | ✅ |
| **C2** | MC | Rata-rata, berapa jam per minggu yang Anda habiskan untuk bekerja selama minggu perkuliahan yang normal? | `Kurang dari 10 jam` / `10–19 jam` / `20–29 jam` / `30–39 jam` / `40 jam atau lebih` | ✅ |
| **C3** | MC + numeric | Sejak semester berapa perkuliahan Anda, Anda mulai bekerja? | `Sudah bekerja sebelum masuk Binus` **OR** `Sejak semester ke-…` (numeric input 1–14, must not exceed B3) | ✅ |
| **C4** | SCALE 1–5 | Dari skala 1-5, seberapa pekerjaan Anda saat ini berkaitan langsung dengan bidang studi Anda di Binus? | `1 — Sangat berkaitan` ↔ `5 — Tidak berkaitan sama sekali` | ✅ |

### C1 Choices

1. Karyawan penuh waktu (≥35 jam/minggu, dengan pemberi kerja tetap)
2. Karyawan paruh waktu (<35 jam/minggu, dengan pemberi kerja tetap)
3. Freelancer / Pekerja gig (berbasis proyek, tanpa pemberi kerja tetap)
4. Wirausaha / Pemilik bisnis sendiri
5. Magang berbayar / Pekerja kontrak
6. Lainnya (free-text)

---

## D. Indikator Performa Akademik

| ID | Type | Question | Options / Validation | Required |
|----|------|----------|----------------------|:---:|
| **D1** | MC | Dibandingkan sebelum Anda mulai bekerja, bagaimana perubahan performa akademik (IPK) Anda secara keseluruhan? | 6 options (see below) | ✅ |
| **D2** | MC | Dalam satu bulan terakhir, berapa kali Anda tidak hadir di kelas tatap muka karena kewajiban pekerjaan? | `Tidak pernah (0 sesi)` / `1–2 sesi` / `3–5 sesi` / `6–10 sesi` / `Lebih dari 10 sesi` | ✅ |
| **D3** | MC | Dalam satu bulan terakhir, berapa kali Anda tidak mengikuti kelas online/virtual karena kewajiban pekerjaan? | Same as D2 | ✅ |
| **D4** | SCALE 1–5 | Seberapa sering Anda mengumpulkan tugas terlambat atau di bawah standar kualitas yang Anda inginkan akibat kewajiban pekerjaan? | `1 — Tidak Pernah` ↔ `5 — Sangat Sering / Selalu` | ✅ |

### D1 Choices

1. Saya sudah bekerja sebelum masuk Binus (tidak berlaku)
2. Menurun Signifikan
3. Menurun Sedikit
4. Tidak Berubah Secara Berarti
5. Meningkat Sedikit
6. Meningkat Signifikan

---

## E. Stress, Burnout & Manajemen Waktu

| ID | Type | Question | Left label ↔ Right label | Required |
|----|------|----------|---------------------------|:---:|
| **E1** | SCALE 1–5 | Bagaimana Anda menilai tingkat stres akademik Anda saat ini akibat menyeimbangkan pekerjaan dan perkuliahan? | `Tidak Stress Sama Sekali` ↔ `Stres ekstrem / Sangat berat` | ✅ |
| **E2** | SCALE 1–5 | Seberapa sering Anda mengalami kelelahan fisik atau mental (burnout) yang Anda kaitkan dengan kombinasi pekerjaan dan kuliah? | `Tidak pernah` ↔ `Hampir selalu / Setiap hari` | ✅ |
| **E3** | SCALE 1–5 | Bagaimana Anda menilai kemampuan Anda dalam mengatur waktu secara efektif antara pekerjaan dan tanggung jawab akademik? | `Sangat buruk` ↔ `Sangat baik` | ✅ |
| **E4** | SCALE 1–5 | Seberapa baik Anda memahami dan mengingat materi perkuliahan yang diajarkan di kelas yang Anda hadiri? | `Sangat tidak paham` ↔ `Sangat paham` | ✅ |
| **E5** | SCALE 1–5 | Seberapa sering jadwal kerja Anda berkonflik langsung dengan jadwal kuliah atau persiapan ujian Anda? | `Tidak pernah` ↔ `Sangat sering / Selalu` | ✅ |

---

## F. Persepsi Dampak & Refleksi Terbuka

| ID | Type | Question | Options / Validation | Required |
|----|------|----------|----------------------|:---:|
| **F1** | MC | Secara keseluruhan, menurut Anda apakah bekerja sambil kuliah memberikan dampak positif atau negatif secara neto terhadap performa akademik Anda? | 5 options (see below) | ✅ |
| **F2** | PARAGRAPH | Apa tantangan terbesar yang Anda hadapi dalam menyeimbangkan pekerjaan dan tanggung jawab akademik? | Free text, max 2000 chars | ❌ optional |

### F1 Choices

1. Sangat positif, bekerja sangat membantu akademik saya
2. Cukup positif, bekerja sedikit menguntungkan akademik saya
3. Netral, tidak ada dampak yang berarti
4. Cukup negatif, bekerja sedikit merugikan akademik saya
5. Sangat negatif, bekerja sangat merugikan akademik saya

---

## [PRESURVEY ONLY] Feedback Survey

| ID | Type | Question | Options / Validation | Required |
|----|------|----------|----------------------|:---:|
| **FB1** | MC | Apakah ada pertanyaan yang membingungkan atau sulit dipahami? | `Ya` / `Tidak` | ✅ |
| **FB1_Detail** | QUESTION_PICKER (`reason`) | Pertanyaan mana yang membingungkan, dan kenapa? | Multi-select from B–F questions + free-text reason per pick | ✅ if FB1=Ya |
| **FB2** | MC | Apakah ada pertanyaan yang terasa berulang atau tidak perlu? | `Ya` / `Tidak` | ✅ |
| **FB2_Detail** | QUESTION_PICKER (`simple`) | Pertanyaan mana yang terasa berulang atau tidak perlu? | Multi-select only | ✅ if FB2=Ya |
| **FB3** | MC | Apakah ada pertanyaan di mana pilihan jawabannya kurang lengkap? | `Ya` / `Tidak` | ✅ |
| **FB3_Detail** | QUESTION_PICKER (`missing_option`) | Pertanyaan mana yang opsinya kurang, dan opsi apa yang seharusnya ada? | Multi-select + free-text "missing option" per pick | ✅ if FB3=Ya |
| **FB4** | MC | Kira-kira berapa lama waktu yang kamu butuhkan untuk mengisi form ini? | `2 menit atau kurang` / `5 menit atau kurang` / `10 menit atau kurang` / `Lebih dari 10 menit` | ✅ |
| **FB5** | PARAGRAPH | Ada saran lain untuk memperbaiki form ini? | Free text, max 2000 chars | ❌ optional |

QUESTION_PICKER references questions from sections **B–F** only (Section A excluded).

---

## Summary

- **33 user-facing items** across 7 wizard steps: A(5) + B(5) + C(4) + D(4) + E(5) + F(2) + Feedback(8). The Feedback section's 3 QUESTION_PICKER items (FB1_Detail, FB2_Detail, FB3_Detail) are conditional — they only render when the parent FB question is "Ya".
- **Item types**: TEXT (5), MC (12 incl. 3 with `Lainnya`/custom-other), LIST (1), PARAGRAPH (2), SCALE 1–5 (7), QUESTION_PICKER (3 conditional)
- **Cross-field / validation rules**: A4/A5 screening, NIM regex, email-binus regex, GPA range, semester range, C3 ≤ B3, FB×_Detail required when FB×=Ya, untouched SCALE blocked
- **43-column** Google Sheet response schema (6 meta + 5 A + 7 B + 5 C + 4 D + 5 E + 2 F + 9 FB)
