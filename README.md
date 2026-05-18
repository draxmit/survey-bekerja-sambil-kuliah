# survey-bekerja-sambil-kuliah

Custom web survey for **DTSC6011001 — Survey and Sampling Methods** (Kelompok 2, 2025/2026): *Identifikasi Performa Akademik Mahasiswa Binus yang Berkuliah Sambil Bekerja.*

A dark-themed multi-step form deployed on Vercel that proxies submissions to a Google Apps Script Web App, which validates and writes one row per response into a Google Sheet.

---

## Two releases

This repo contains **two parallel versions** of the survey, each in its own folder. They share the same architecture (Vercel + Apps Script + Google Sheet) but have different question sets.

| | `before/` | `after/` |
|---|---|---|
| **Audience** | Internal pilot / presurvey testers | Public live release |
| **Identity collection** | Nama, Email Binus, NIM (required) | Anonymous |
| **Section A items** | 5 (incl. identity) | 2 (screening only) |
| **Feedback section** | Yes — FB1–FB5 with question-picker | Stripped |
| **C4 scale direction** | `1 = Sangat berkaitan` ↔ `5 = Tidak berkaitan` | `1 = Sangat tidak berkaitan` ↔ `5 = Sangat berkaitan` *(flipped)* |
| **D1 framing** | "Dibandingkan sebelum Anda mulai bekerja, bagaimana perubahan IPK Anda?" (6 options incl. `tidak berlaku`) | "Menurut Anda, bagaimana dampak pekerjaan Anda terhadap IPK Anda?" (5 options) *(reworded so respondents who worked before college aren't a special case)* |
| **Question title prefixes** | `A1.`, `B3.`, etc. shown on user side | Stripped (section labels still shown) |
| **User-facing items** | 25 always-visible + 3 conditional pickers | 22 |
| **Wizard steps** | 7 (A → Feedback) | 6 (A → F) |
| **Sheet columns** | 43 | 32 |
| **Estimated fill time** | 5–8 min | 3–5 min |
| **Internal IDs preserved** | n/a | yes — A4→A1, A5→A2; B/C/D/E/F unchanged; sheet column codes match |
| **Live URL** | https://survey-kuliah-sambil-kerja.vercel.app | https://kuliah-sambil-kerja.vercel.app |

Each folder has its own `README.md`, `QUESTIONS.md`, `Code.gs`, and `Web/` and is deployed as a separate Vercel project against a separate Google Sheet.

---

## Question map — before / after

Every `before/` question is listed with its `after/` fate. Legend:
- **✅ preserved** — same content kept in `after/`, possibly renumbered
- **❌ stripped** — removed in `after/`

| Before ID | Type | Question | After ID | Status / Notes |
|---|---|---|---|---|
| **A1** | TEXT | Nama | — | ❌ identity stripped |
| **A2** | TEXT | Email Binus *(regex `@binus.ac.id`)* | — | ❌ identity stripped |
| **A3** | TEXT | NIM *(regex 10 digits, year 23–29)* | — | ❌ identity stripped |
| **A4** | MC | Apakah Anda saat ini merupakan mahasiswa aktif Universitas Bina Nusantara dengan pendidikan S1? *(Ya / Tidak, Tidak = screen-out)* | **A1** | ✅ renumbered A4 → A1, lightly reworded ("dengan pendidikan S1" → "yang sedang menjalani pendidikan S1") for natural Indonesian phrasing |
| **A5** | MC | Apakah Anda saat ini bekerja dalam bentuk apa pun sembari kuliah? *(Ya / Tidak, Tidak = screen-out)* | **A2** | ✅ renumbered A5 → A2 |
| **B1** | MC + Lainnya | Apa Fakultas Anda di Universitas Bina Nusantara? *(8 fakultas + Lainnya)* | **B1** | ✅ preserved |
| **B2** | LIST (combobox) | Apa Jurusan Anda di Universitas Bina Nusantara? *(filtered by B1; full list toggle; `TIDAK ADA DI DAFTAR` fallback)* | **B2** | ✅ preserved |
| **B3** | TEXT | Anda saat ini berada di semester berapa? *(integer 1–14)* | **B3** | ✅ preserved |
| **B4** | TEXT | Berapa IPK (Indeks Prestasi Kumulatif) terbaru/terakhir Anda? *(0.00–4.00)* | **B4** | ✅ preserved |
| **B5** | TEXT | Berapa IPK Anda sebelum mulai bekerja? *(0.00–4.00; jika sudah bekerja sebelum masuk Binus, masukkan IPK Semester 1)* | **B5** | ✅ preserved |
| **C1** | MC + Lainnya | Apa yang paling tepat menggambarkan jenis pekerjaan utama Anda saat ini? *(5 pilihan + Lainnya)* | **C1** | ✅ preserved |
| **C2** | MC | Rata-rata, berapa jam per minggu yang Anda habiskan untuk bekerja selama minggu perkuliahan yang normal? *(<10 / 10–19 / 20–29 / 30–39 / ≥40 jam)* | **C2** | ✅ preserved |
| **C3** | MC + numeric | Sejak semester berapa perkuliahan Anda, Anda mulai bekerja? *(`Sudah bekerja sebelum masuk Binus` atau `Sejak semester ke-…` 1–14, ≤ B3)* | **C3** | ✅ preserved |
| **C4** | SCALE 1–5 | Dari skala 1-5, seberapa pekerjaan Anda saat ini berkaitan langsung dengan bidang studi Anda di Binus? | **C4** | ✅ preserved — but **scale labels flipped**: `1 = Sangat tidak berkaitan` ↔ `5 = Sangat berkaitan` (was reversed in `before/`) |
| **D1** | MC | Dibandingkan sebelum Anda mulai bekerja, bagaimana perubahan performa akademik (IPK) Anda secara keseluruhan? *(6 pilihan incl. `Saya sudah bekerja sebelum masuk Binus (tidak berlaku)`)* | **D1** | ✅ **reworded** — `after/` asks "Menurut Anda, bagaimana dampak pekerjaan Anda terhadap IPK Anda?" (5 options, "tidak berlaku" dropped because the new wording works regardless of when respondent started working) |
| **D2** | MC | Dalam satu bulan terakhir, berapa kali Anda tidak hadir di kelas tatap muka karena kewajiban pekerjaan? *(5 buckets: 0 / 1–2 / 3–5 / 6–10 / >10 sesi)* | **D2** | ✅ preserved |
| **D3** | MC | Dalam satu bulan terakhir, berapa kali Anda tidak mengikuti kelas online/virtual karena kewajiban pekerjaan? *(same 5 buckets as D2)* | **D3** | ✅ preserved |
| **D4** | SCALE 1–5 | Seberapa sering Anda mengumpulkan tugas terlambat atau di bawah standar kualitas yang Anda inginkan akibat kewajiban pekerjaan? *(Tidak Pernah ↔ Sangat Sering/Selalu)* | **D4** | ✅ preserved |
| **E1** | SCALE 1–5 | Bagaimana Anda menilai tingkat stres akademik Anda saat ini akibat menyeimbangkan pekerjaan dan perkuliahan? *(Tidak Stres ↔ Stres ekstrem)* | **E1** | ✅ preserved |
| **E2** | SCALE 1–5 | Seberapa sering Anda mengalami kelelahan fisik atau mental (burnout) yang Anda kaitkan dengan kombinasi pekerjaan dan kuliah? *(Tidak pernah ↔ Hampir selalu)* | **E2** | ✅ preserved |
| **E3** | SCALE 1–5 | Bagaimana Anda menilai kemampuan Anda dalam mengatur waktu secara efektif antara pekerjaan dan tanggung jawab akademik? *(Sangat buruk ↔ Sangat baik)* | **E3** | ✅ preserved |
| **E4** | SCALE 1–5 | Seberapa baik Anda memahami dan mengingat materi perkuliahan yang diajarkan di kelas yang Anda hadiri? *(Sangat tidak paham ↔ Sangat paham)* | **E4** | ✅ preserved |
| **E5** | SCALE 1–5 | Seberapa sering jadwal kerja Anda berkonflik langsung dengan jadwal kuliah atau persiapan ujian Anda? *(Tidak pernah ↔ Sangat sering)* | **E5** | ✅ preserved |
| **F1** | MC | Secara keseluruhan, menurut Anda apakah bekerja sambil kuliah memberikan dampak positif atau negatif secara neto terhadap performa akademik Anda? *(5 pilihan: Sangat positif → Sangat negatif)* | **F1** | ✅ preserved |
| **F2** | PARAGRAPH | Apa tantangan terbesar yang Anda hadapi dalam menyeimbangkan pekerjaan dan tanggung jawab akademik? *(opsional, max 2000 char)* | **F2** | ✅ preserved |
| **FB1** | MC | Apakah ada pertanyaan yang membingungkan atau sulit dipahami? *(Ya / Tidak)* | — | ❌ feedback section stripped |
| **FB1_Detail** | QUESTION_PICKER (reason) | Pertanyaan mana yang membingungkan, dan kenapa? *(conditional on FB1=Ya; multi-select B–F + reason per pick)* | — | ❌ feedback section stripped |
| **FB2** | MC | Apakah ada pertanyaan yang terasa berulang atau tidak perlu? *(Ya / Tidak)* | — | ❌ feedback section stripped |
| **FB2_Detail** | QUESTION_PICKER (simple) | Pertanyaan mana yang terasa berulang? *(conditional on FB2=Ya; multi-select)* | — | ❌ feedback section stripped |
| **FB3** | MC | Apakah ada pertanyaan di mana pilihan jawabannya kurang lengkap? *(Ya / Tidak)* | — | ❌ feedback section stripped |
| **FB3_Detail** | QUESTION_PICKER (missing) | Pertanyaan mana yang opsinya kurang dan opsi apa yang seharusnya ada? *(conditional on FB3=Ya; multi-select + missing-option text per pick)* | — | ❌ feedback section stripped |
| **FB4** | MC | Kira-kira berapa lama waktu yang kamu butuhkan untuk mengisi form ini? *(2 / 5 / 10 / >10 menit)* | — | ❌ feedback section stripped |
| **FB5** | PARAGRAPH | Ada saran lain untuk memperbaiki form ini? *(opsional)* | — | ❌ feedback section stripped |

### Summary

| | Count |
|---|---|
| `before/` items total | 33 (25 always-visible + 3 conditional FB pickers + 5 always-visible feedback) |
| `before/` items preserved into `after/` | **22** (all of B, C, D, E, F + A4→A1, A5→A2) |
| `before/` items stripped | **11** (A1–A3 identity + 8 feedback items) |
| `after/` items total | 22 |
| Modified in `after/` | C4 scale labels flipped (1 = unrelated → 5 = related); D1 reworded to a perception-of-impact question (5 options, "tidak berlaku" dropped); identity prefixes (`A1.`, `B3.`, …) removed from user-facing titles |

For the exact rendered question text, options, and validation per release, see:
- [`before/QUESTIONS.md`](./before/QUESTIONS.md) — full 33-item breakdown
- [`after/QUESTIONS.md`](./after/QUESTIONS.md) — slim 22-item breakdown

---

## Repo layout

```
.
├── README.md                    you are here
├── LICENSE                      MIT
├── .gitignore
├── before/
│   ├── README.md                full architecture / deployment / verification
│   ├── QUESTIONS.md             33-item reference
│   ├── Code.gs                  43-column Apps Script
│   └── Web/
│       ├── index.html
│       ├── .env.example
│       └── api/submit.js
└── after/
    ├── README.md                deltas vs. before/
    ├── QUESTIONS.md             22-item reference
    ├── Code.gs                  32-column Apps Script
    └── Web/
        ├── index.html
        ├── favicon.svg
        ├── .env.example
        └── api/submit.js
```

---

## Quick start

1. **Read** [`before/README.md`](./before/README.md) for the full architecture, security notes, and deployment guide.
2. **For the live release**, deploy `after/` (paste `after/Code.gs` into a fresh Apps Script project, set `GAS_URL` in Vercel, deploy `after/Web/`).
3. **For the pilot**, do the same with `before/` against a separate Sheet + Vercel project.

Each release is fully self-contained — modifying one does not affect the other.

---

## License

MIT — see [LICENSE](./LICENSE).
