# `after/` — live release

Slim, anonymous version of the survey, distributed publicly after the presurvey/pilot phase.

For the full code architecture, deployment guide, and verification checklist, see the **[before/ README](../before/README.md)** — everything there applies, except for the form-structure differences listed below.

---

## What's different from `before/`

| Change | Reason |
|---|---|
| **Identity questions removed** (Nama, Email Binus, NIM) | Anonymous responses; no PII collection. |
| **Old A4 / A5 → renumbered A1 / A2** | Section A now contains only the two screening questions. |
| **Feedback section stripped** (FB1–FB5) | Presurvey-only diagnostics no longer needed. |
| **C4 scale flipped** | `1 — Sangat tidak berkaitan` ↔ `5 — Sangat berkaitan`. Rationale: matches the natural intuition (higher number = more positive/stronger). |
| **D1 reworded** | From "Dibandingkan sebelum Anda mulai bekerja, bagaimana perubahan performa akademik (IPK) Anda secara keseluruhan?" (6 options incl. `Saya sudah bekerja sebelum masuk Binus (tidak berlaku)`) to "Menurut Anda, bagaimana dampak pekerjaan Anda terhadap IPK Anda?" (5 options). Rationale: the new framing asks perceived impact without assuming the respondent started working after entering Binus, so the "tidak berlaku" special case is no longer needed. |
| **Question titles drop the `Xn.` prefix** on the user side | Cleaner UI for end users. Section labels (A, B, C…) still shown. Internal IDs unchanged. |
| **Sheet schema reduced from 43 to 32 columns** | Fewer columns since identity + feedback dropped. |
| **Estimated fill time: 3–5 min** (was 5–8) | About half the question count. |

---

## Form structure (6 steps)

| # | Section | Items |
|---|---|---|
| 1 | A. Seleksi Kriteria | A1 mahasiswa aktif?, A2 sedang bekerja? |
| 2 | B. Demografis & Akademik | Fakultas, Jurusan, Semester, IPK terbaru, IPK pre-kerja |
| 3 | C. Profil Pekerjaan | Jenis pekerjaan, Jam/minggu, Semester mulai bekerja, C4 relevansi job–studi |
| 4 | D. Indikator Performa | Perubahan IPK, Absen offline, Absen online, D4 keterlambatan tugas |
| 5 | E. Stres, Burnout & Manajemen Waktu | E1–E5 Likert 1–5 |
| 6 | F. Persepsi Dampak & Refleksi | F1 dampak neto, F2 tantangan terbesar (opsional) |

### Branching / screening
- A1 = Tidak → screen-out card, no submission sent
- A2 = Tidak → screen-out card, no submission sent
- C3 cross-check: "Sejak semester ke-N" cannot exceed B3 (current semester)

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

⚠️ This schema is **not compatible** with the `before/` 43-column sheet. Deploy `after/Code.gs` against a **new Google Sheet** (or delete all rows + the existing header so the script regenerates the new 32-column header on first submission).

---

## Deployment (summary)

Same as `before/`, two stages:

1. Paste `after/Code.gs` into a fresh Apps Script project bound to a new Google Sheet → Deploy as Web App (Anyone access) → copy `/exec` URL.
2. From `after/Web/`, run `vercel`, set `GAS_URL` env var, then `vercel --prod`.

The two releases (`before/` and `after/`) are independent deployments — separate Vercel projects, separate Sheets, separate `/exec` URLs.

---

## Question set

See [QUESTIONS.md](./QUESTIONS.md) for the full per-question breakdown of this release.
