# survey-bekerja-sambil-kuliah

Custom web survey for **DTSC6011001 — Survey and Sampling Methods** (Kelompok 2, 2025/2026): *Identifikasi Performa Akademik Mahasiswa Binus yang Berkuliah Sambil Bekerja.*

A dark-themed multi-step form deployed on Vercel that proxies submissions to a Google Apps Script Web App, which validates and writes one row per response into a Google Sheet.

---

## Stack

- **Frontend**: vanilla JS, Instrument Sans, no framework. Single `index.html` (~89 KB).
- **API proxy**: Vercel serverless function (Node.js, ESM) that forwards to Apps Script with a 25 s `AbortController` timeout.
- **Backend**: Google Apps Script (V8) bound to a Google Sheet. Server-side regex/range validation, anti-spam, `LockService` for concurrent writes.

---

## Repository layout

```
.
├── README.md
├── LICENSE                  MIT
├── .gitignore
├── Code.gs                  Google Apps Script (paste into Apps Script editor)
└── Web/
    ├── index.html           Survey UI (single page)
    ├── .env.example         Template — copy to .env (gitignored) and set GAS_URL
    └── api/
        └── submit.js        Vercel serverless proxy → Google Apps Script
```

---

## Form structure

7 steps (one PAGE_BREAK = one step). Final step is the feedback survey — submit happens directly there.

| # | Section | Items |
|---|---|---|
| 1 | A. Seleksi Kriteria | Nama, Email Binus, NIM, A4 mahasiswa aktif?, A5 sedang bekerja? |
| 2 | B. Demografis & Akademik | Fakultas, Jurusan, Semester, IPK terbaru, IPK pre-kerja |
| 3 | C. Profil Pekerjaan | Jenis pekerjaan, Jam/minggu, Semester mulai bekerja, C4 relevansi job–studi |
| 4 | D. Indikator Performa | Perubahan IPK, Absen offline, Absen online, D4 keterlambatan tugas |
| 5 | E. Stres, Burnout & Manajemen Waktu | E1–E5 Likert 1–5 |
| 6 | F. Persepsi Dampak & Refleksi | F1 dampak neto, F2 tantangan terbesar (opsional) |
| 7 | Feedback (Presurvey) | FB1–FB4 (Y/N + question-picker), FB5 saran |

### Branching / screening
- A4 = Tidak → screen-out card, no submission sent
- A5 = Tidak → screen-out card, no submission sent
- C3 cross-check: "Sejak semester ke-N" cannot exceed B3 (current semester)

### Item types
- TEXT (with regex per field), PARAGRAPH (textarea, 2000 char cap)
- MC with optional "Lainnya" / custom "other-value" (numeric input for C3)
- LIST (B2: combobox filtered by B1 fakultas, with full-list toggle)
- SCALE (Google Forms-style Likert radio buttons, no draggable thumb)
- QUESTION_PICKER (modal popup checkbox list for FB1/FB2/FB3 detail)

---

## Security & integrity

- **Server-side re-validation** of every field (regex, range, choice membership, cross-field rules) — client validation can be bypassed but server validation cannot.
- **Anti-spam**: hidden honeypot field + minimum 5-second completion time.
- **Defensive screening**: server rejects A4=Tidak / A5=Tidak even if client bypass attempted.
- **Concurrency**: `LockService.getScriptLock().waitLock(10000)` wraps every sheet write.
- **XSS**: all user input is rendered via `textContent` / `escapeHTML`; `body { user-select: none }` with explicit override on inputs.
- **Telemetry**: `clientStartTime`, `clientSubmitTime`, `totalSeconds`, `userAgent` (truncated 200 chars) stored alongside answers.

---

## Sheet schema (43 columns)

```
[meta]    submissionID, serverTimestamp, clientStartTime, clientSubmitTime, totalSeconds, userAgent
[A]       A1_Nama, A2_Email, A3_NIM, A4_AktifS1, A5_Bekerja
[B]       B1_Fakultas, B1_Lainnya, B2_Jurusan, B2_Lainnya, B3_Semester, B4_IPK_Terbaru, B5_IPK_PreKerja
[C]       C1_JenisPekerjaan, C1_Lainnya, C2_JamPerMinggu, C3_SemesterMulaiKerja, C4_RelasiPekerjaan_1to5
[D]       D1_PerubahanIPK, D2_AbsenOffline, D3_AbsenOnline, D4_TugasTerlambat_1to5
[E]       E1_Stress_1to5, E2_Burnout_1to5, E3_ManajemenWaktu_1to5, E4_PemahamanMateri_1to5, E5_KonflikJadwal_1to5
[F]       F1_PersepsiDampak, F2_TantanganTerbesar
[FB]      FB1_AdaBingung, FB1_Detail, FB2_AdaUlang, FB2_Detail, FB3_OpsiKurang, FB3_Detail, FB4_DurasiIsi, FB5_SaranLain
```

`C3_SemesterMulaiKerja` stores either `"Sudah bekerja sebelum masuk Binus"` or `"Semester N"` (combined from the radio choice + numeric input).

---

## Deployment

### 1. Backend (Google Sheet + Apps Script)

1. Create a new Google Sheet (no preset tabs needed).
2. **Extensions → Apps Script** → delete the sample code → paste the contents of `Code.gs`.
3. Save (`Ctrl+S`), name the project.
4. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorize the script when prompted (review permissions → allow).
6. Copy the `/exec` URL.

### 2. Frontend (Vercel)

```bash
# from repo root
cd Web
vercel              # initial deploy (preview)
vercel env add GAS_URL   # paste the /exec URL, apply to all environments
vercel --prod       # production deploy
```

The first deploy creates the project. Future updates: `vercel --prod` from `Web/`.

If you prefer GitHub-integration: import the repo at vercel.com/new, set **Root Directory** to `Web`, add the `GAS_URL` env var.

### 3. After every Code.gs change

Apps Script deployments are pinned to versions — saving the editor isn't enough.

1. Save (`Ctrl+S`)
2. **Deploy → Manage deployments → pencil → Version: New version → Deploy**

The `/exec` URL stays the same; no Vercel changes needed.

---

## Local dev

The form is a single `index.html` — open it in any browser to iterate on UI / validation. Submission requires the deployed backend; locally, `/api/submit` will fail unless you run `vercel dev` in `Web/` with `GAS_URL` set.

---

## Verification checklist

- [ ] A2 = `foo@gmail.com` → blocks at Step 1 with "Gunakan @binus.ac.id"
- [ ] A3 = `12345` → blocks with "10 digit dengan prefix tahun 23–29"
- [ ] B4 = `5.00` → blocks with "harus antara 0.00 dan 4.00"
- [ ] A4 = Tidak → screen-out card, refuses submit
- [ ] C3 "Sejak semester ke-…" + N where N > B3 → "lebih dari semester saat ini (semester B3)"
- [ ] Untouched SCALE → blocks Next with "Mohon pilih salah satu nilai"
- [ ] FB1 = Ya, picker empty → blocks Next, trigger button highlighted red
- [ ] Submit twice rapidly from two tabs → both rows appear (LockService working)
- [ ] Devtools: POST to `/api/submit` with `B4=5.5` → server returns `{status:'error'}`
- [ ] Mobile (375×667): combobox toggle wraps, slider radios fit, modal footer stacks

---

## License

MIT — see [LICENSE](./LICENSE).
