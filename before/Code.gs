/**
 * Survey "Dampak Bekerja Sambil Kuliah" — Private API
 * Receives data from Vercel and writes to a Google Sheet bound to this script.
 *
 * Deployment:
 *   1. Bind this Apps Script project to a Google Sheet (Resources > Cloud Project, or simply create
 *      the script from inside a Sheet so SpreadsheetApp.getActiveSpreadsheet() works).
 *   2. Deploy > New deployment > Web app:
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Copy the /exec URL into the Vercel env var GAS_URL (and update Web/api/submit.js fallback).
 */

const SHEET_NAME = 'Responses';

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@binus\.ac\.id$/i;
const NIM_RE   = /^(23|24|25|26|27|28|29)\d{8}$/;
const GPA_RE   = /^[0-4](\.\d{1,2})?$/;

const CHOICES = {
  A4: ['Ya', 'Tidak'],
  A5: ['Ya', 'Tidak'],
  // SCCA removed (no S1 majors map there); 'Faculty of Engineering (FE)' added in its place.
  B1: [
    'School of Computer Science (SOCS)',
    'School of Design (SOD)',
    'Faculty of Humanities (FOH)',
    'School of Information Systems (SOIS)',
    'Binus Business School (BBS)',
    'Faculty of Digital Communication and Hotel & Tourism (FDCHT)',
    'School of Accounting (SOA)',
    'Faculty of Engineering (FE)'
  ],
  // 51 verified Binus undergraduate-tier majors (Sarjana / Sarjana Terapan) per binus.ac.id/program/.
  // 18 unverified items removed; TIDAK ADA DI DAFTAR remains as fallback.
  B2: [
    // SOCS (8)
    'Artificial Intelligence','Computer Science','Computer Science & Mathematics',
    'Computer Science & Statistics','Cyber Security','Data Science',
    'Game Application & Technology','Software Engineering Program',
    // SOIS (6)
    'Business Analytics','Business Information Tech','Digital Business Innovation',
    'Digital Tech in Marine Science','Digital Technology in Fishery','Information Systems',
    // SOD (7)
    'Animation','Creative Advertising','Fashion','Film',
    'Interior Design','New Media','Visual Communication Design',
    // SOA (3)
    'Accounting','Finance','Taxation',
    // FDCHT (6)
    'Business Hotel Management','Creative Communication','Digital Media Communication',
    'Event & Travel Business','Hotel Management','Marketing Communication',
    // FOH (8)
    'Business Law','Creative Digital English','Digital Psychology',
    'Global Business Chinese','International Relations','Japanese Popular Culture',
    'Primary Teacher Education','Psychology',
    // BBS (6)
    'Business Creation','Business Management','Digital Business',
    'Global Business Marketing','International Business','Management',
    // FE (7)
    'Architecture','Biotechnology','Civil Engineering','Computer Engineering',
    'Food Technology','Industrial Engineering','Professional Engineer Program',
    // Fallback
    'TIDAK ADA DI DAFTAR'
  ],
  C1: [
    'Karyawan penuh waktu (≥35 jam/minggu, dengan pemberi kerja tetap)',
    'Karyawan paruh waktu (<35 jam/minggu, dengan pemberi kerja tetap)',
    'Freelancer / Pekerja gig (berbasis proyek, tanpa pemberi kerja tetap)',
    'Wirausaha / Pemilik bisnis sendiri',
    'Magang berbayar / Pekerja kontrak'
  ],
  C2: [
    'Kurang dari 10 jam','10–19 jam','20–29 jam','30–39 jam','40 jam atau lebih'
  ],
  C3: [
    'Sudah bekerja sebelum masuk Binus',
    'Sejak semester tertentu'
  ],
  D1: [
    'Saya sudah bekerja sebelum masuk Binus (tidak berlaku)',
    'Menurun Signifikan','Menurun Sedikit','Tidak Berubah Secara Berarti',
    'Meningkat Sedikit','Meningkat Signifikan'
  ],
  D2: ['Tidak pernah (0 sesi)','1–2 sesi','3–5 sesi','6–10 sesi','Lebih dari 10 sesi'],
  D3: ['Tidak pernah (0 sesi)','1–2 sesi','3–5 sesi','6–10 sesi','Lebih dari 10 sesi'],
  F1: [
    'Sangat positif, bekerja sangat membantu akademik saya',
    'Cukup positif, bekerja sedikit menguntungkan akademik saya',
    'Netral, tidak ada dampak yang berarti',
    'Cukup negatif, bekerja sedikit merugikan akademik saya',
    'Sangat negatif, bekerja sangat merugikan akademik saya'
  ],
  FB1: ['Ya','Tidak'],
  FB2: ['Ya','Tidak'],
  FB3: ['Ya','Tidak'],
  FB4: ['2 menit atau kurang','5 menit atau kurang','10 menit atau kurang','Lebih dari 10 menit']
};

// Maps an MC field id to its "other"-radio value (the radio that requires a free-text companion).
// For C3 the other-value is 'Sejak semester tertentu' which expects a numeric 1-14 in *_Lainnya.
const HAS_OTHER = {
  B1: 'Lainnya',
  C1: 'Lainnya',
  C3: 'Sejak semester tertentu'
};

const SCALE_BOUNDS = {
  C4: [1, 5],
  D4: [1, 5],
  E1: [1, 5],
  E2: [1, 5],
  E3: [1, 5],
  E4: [1, 5],
  E5: [1, 5]
};

const HEADER = [
  'submissionID','serverTimestamp','clientStartTime','clientSubmitTime','totalSeconds','userAgent',
  'A1_Nama','A2_Email','A3_NIM','A4_AktifS1','A5_Bekerja',
  'B1_Fakultas','B1_Lainnya','B2_Jurusan','B2_Lainnya','B3_Semester','B4_IPK_Terbaru','B5_IPK_PreKerja',
  'C1_JenisPekerjaan','C1_Lainnya','C2_JamPerMinggu','C3_SemesterMulaiKerja','C4_RelasiPekerjaan_1to5',
  'D1_PerubahanIPK','D2_AbsenOffline','D3_AbsenOnline','D4_TugasTerlambat_1to5',
  'E1_Stress_1to5','E2_Burnout_1to5','E3_ManajemenWaktu_1to5','E4_PemahamanMateri_1to5','E5_KonflikJadwal_1to5',
  'F1_PersepsiDampak','F2_TantanganTerbesar',
  'FB1_AdaBingung','FB1_Detail','FB2_AdaUlang','FB2_Detail','FB3_OpsiKurang','FB3_Detail','FB4_DurasiIsi','FB5_SaranLain'
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const result = submitSurvey(payload);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function submitSurvey(payload) {
  // ── Anti-spam ──────────────────────────────────────────────────────────────
  if (payload.hp_field && String(payload.hp_field).trim().length > 0) {
    // Bot detected — return success but do not write.
    return { status: 'success' };
  }
  const totalSeconds = Number(payload.totalSeconds || 0);
  if (!isFinite(totalSeconds) || totalSeconds < 5) {
    return { status: 'error', message: 'Validasi gagal: durasi pengisian terlalu singkat.' };
  }

  const a = payload.answers || {};

  // ── Field validation ──────────────────────────────────────────────────────
  const errors = [];
  const req = (key, label) => {
    if (!a[key] || String(a[key]).trim().length === 0) {
      errors.push(label + ' wajib diisi.');
    }
  };

  req('A1', 'Nama');
  if (a.A2 && !EMAIL_RE.test(String(a.A2).trim())) errors.push('Email Binus harus diakhiri @binus.ac.id.');
  else req('A2', 'Email Binus');
  if (!a.A3 || String(a.A3).trim().length === 0) {
    errors.push('NIM wajib diisi.');
  } else if (!NIM_RE.test(String(a.A3).trim())) {
    errors.push('NIM harus 10 digit dengan prefix tahun 23–29.');
  }

  // A4, A5 — must be present and equal to 'Ya' (screening already done client-side; defensive check here).
  if (!CHOICES.A4.includes(a.A4)) errors.push('Jawaban A4 tidak valid.');
  if (!CHOICES.A5.includes(a.A5)) errors.push('Jawaban A5 tidak valid.');
  if (a.A4 === 'Tidak' || a.A5 === 'Tidak') {
    return { status: 'error', message: 'Survei ini hanya untuk mahasiswa aktif S1 Binus yang sedang bekerja.' };
  }

  // B1 — choice + optional Lainnya text
  validateChoice(errors, a, 'B1', 'Fakultas');
  // B2 — fixed list; LIST type requires one of the 47 (TIDAK ADA DI DAFTAR is the user's "other" path, with B2_Lainnya text)
  validateChoice(errors, a, 'B2', 'Jurusan');
  if (a.B2 === 'TIDAK ADA DI DAFTAR' && (!a.B2_Lainnya || String(a.B2_Lainnya).trim().length === 0)) {
    errors.push('Jurusan: mohon ketik nama jurusan di kolom yang muncul.');
  }

  validateInt(errors, a, 'B3', 'Semester saat ini', 1, 14);
  validateGPA(errors, a, 'B4', 'IPK terbaru');
  validateGPA(errors, a, 'B5', 'IPK sebelum bekerja');

  validateChoice(errors, a, 'C1', 'Jenis pekerjaan');
  validateChoice(errors, a, 'C2', 'Jam kerja per minggu');
  validateChoice(errors, a, 'C3', 'Semester mulai bekerja');
  validateScale(errors, a, 'C4');

  validateChoice(errors, a, 'D1', 'Perubahan IPK');
  validateChoice(errors, a, 'D2', 'Absen kelas tatap muka');
  validateChoice(errors, a, 'D3', 'Absen kelas online');
  validateScale(errors, a, 'D4');

  validateScale(errors, a, 'E1');
  validateScale(errors, a, 'E2');
  validateScale(errors, a, 'E3');
  validateScale(errors, a, 'E4');
  validateScale(errors, a, 'E5');

  validateChoice(errors, a, 'F1', 'Persepsi dampak');
  // F2 paragraph — optional

  validateChoice(errors, a, 'FB1', 'Feedback (bingung)');
  validateChoice(errors, a, 'FB2', 'Feedback (berulang)');
  validateChoice(errors, a, 'FB3', 'Feedback (opsi kurang)');
  validateChoice(errors, a, 'FB4', 'Feedback (durasi)');
  // Conditional requirement: when the parent FB question is 'Ya', the *_Detail picker must be non-empty.
  if (a.FB1 === 'Ya' && (!a.FB1_Detail || String(a.FB1_Detail).trim().length === 0)) {
    errors.push('Pilih minimal satu pertanyaan untuk Feedback (membingungkan).');
  }
  if (a.FB2 === 'Ya' && (!a.FB2_Detail || String(a.FB2_Detail).trim().length === 0)) {
    errors.push('Pilih minimal satu pertanyaan untuk Feedback (berulang).');
  }
  if (a.FB3 === 'Ya' && (!a.FB3_Detail || String(a.FB3_Detail).trim().length === 0)) {
    errors.push('Pilih minimal satu pertanyaan untuk Feedback (opsi kurang).');
  }
  // FB5_SaranLain remains optional

  if (errors.length > 0) {
    return { status: 'error', message: 'Validasi gagal: ' + errors.join(' ') };
  }

  // ── Persist ───────────────────────────────────────────────────────────────
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw new Error('Spreadsheet aktif tidak ditemukan. Bind script ke sebuah Google Sheet terlebih dahulu.');
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADER);
      sheet
        .getRange(1, 1, 1, HEADER.length)
        .setFontWeight('bold')
        .setBackground('#f3f3f3');
      sheet.setFrozenRows(1);
    }

    const now = new Date();
    const submissionID = now.toISOString();
    const ua = String(payload.userAgent || '').substring(0, 200);

    const row = [
      submissionID,
      now,
      payload.clientStartTime || '',
      payload.clientSubmitTime || '',
      totalSeconds,
      ua,
      str(a.A1), str(a.A2), str(a.A3), str(a.A4), str(a.A5),
      str(a.B1), str(a.B1_Lainnya), str(a.B2), str(a.B2_Lainnya), str(a.B3), str(a.B4), str(a.B5),
      str(a.C1), str(a.C1_Lainnya), str(a.C2),
      // C3 — collapse choice + numeric companion into a single human-readable cell:
      //   "Sudah bekerja sebelum masuk Binus" OR "Semester N"
      (a.C3 === 'Sejak semester tertentu')
        ? ('Semester ' + str(a.C3_Lainnya).trim())
        : str(a.C3),
      num(a.C4),
      str(a.D1), str(a.D2), str(a.D3), num(a.D4),
      num(a.E1), num(a.E2), num(a.E3), num(a.E4), num(a.E5),
      str(a.F1), str(a.F2),
      str(a.FB1), str(a.FB1_Detail), str(a.FB2), str(a.FB2_Detail),
      str(a.FB3), str(a.FB3_Detail), str(a.FB4), str(a.FB5)
    ];

    sheet.appendRow(row);

    return { status: 'success', submissionID: submissionID };
  } catch (error) {
    return { status: 'error', message: 'Gagal menyimpan data: ' + error.toString() };
  } finally {
    try { lock.releaseLock(); } catch (e) { /* noop */ }
  }
}

// ── helpers ─────────────────────────────────────────────────────────────────
function validateChoice(errors, a, key, label) {
  const list = CHOICES[key];
  const val = a[key];
  if (val === undefined || val === null || String(val).length === 0) {
    errors.push(label + ' wajib diisi.');
    return;
  }
  const otherValue = HAS_OTHER[key]; // string ('Lainnya', 'Sejak semester tertentu', ...) or undefined
  if (otherValue && val === otherValue) {
    const lainnya = a[key + '_Lainnya'];
    if (!lainnya || String(lainnya).trim().length === 0) {
      errors.push(label + ': mohon isi.');
      return;
    }
    // C3 numeric semester validation + cross-check against B3 (current semester)
    if (key === 'C3') {
      const t = String(lainnya).trim();
      if (!/^\d+$/.test(t)) { errors.push('Semester harus berupa angka bulat.'); return; }
      const n = parseInt(t, 10);
      if (n < 1 || n > 14) { errors.push('Semester harus antara 1 dan 14.'); return; }
      const b3 = parseInt(String(a.B3 || '').trim(), 10);
      if (Number.isInteger(b3) && n > b3) {
        errors.push('Semester mulai bekerja lebih dari semester saat ini (semester ' + b3 + ').');
      }
    }
    return;
  }
  if (list && list.indexOf(String(val)) === -1) {
    errors.push(label + ' bukan pilihan yang valid.');
  }
}

function validateInt(errors, a, key, label, min, max) {
  const raw = a[key];
  if (raw === undefined || raw === null || String(raw).trim().length === 0) {
    errors.push(label + ' wajib diisi.');
    return;
  }
  const s = String(raw).trim();
  if (!/^\d+$/.test(s)) { errors.push(label + ' harus berupa angka bulat.'); return; }
  const n = parseInt(s, 10);
  if (n < min || n > max) errors.push(label + ' harus antara ' + min + ' dan ' + max + '.');
}

function validateGPA(errors, a, key, label) {
  const raw = a[key];
  if (raw === undefined || raw === null || String(raw).trim().length === 0) {
    errors.push(label + ' wajib diisi.');
    return;
  }
  const s = String(raw).trim();
  if (!GPA_RE.test(s)) { errors.push(label + ' harus berformat 0.00–4.00.'); return; }
  const n = parseFloat(s);
  if (n < 0 || n > 4) errors.push(label + ' harus antara 0.00 dan 4.00.');
}

function validateScale(errors, a, key) {
  const bounds = SCALE_BOUNDS[key];
  if (!bounds) return;
  const raw = a[key];
  if (raw === undefined || raw === null || raw === '') {
    errors.push(key + ' wajib diisi (geser slider).');
    return;
  }
  const n = Number(raw);
  if (!Number.isInteger(n) || n < bounds[0] || n > bounds[1]) {
    errors.push(key + ' harus integer antara ' + bounds[0] + ' dan ' + bounds[1] + '.');
  }
}

function str(v) {
  if (v === undefined || v === null) return '';
  return String(v);
}

function num(v) {
  if (v === undefined || v === null || v === '') return '';
  const n = Number(v);
  return isFinite(n) ? n : '';
}
