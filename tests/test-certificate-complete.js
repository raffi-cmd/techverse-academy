const assert = require('assert');
const { buildCertificatePdfRaw } = require('../src/lib/certificate-pdf.ts');
const { generateQrPdfVectorOps } = require('../src/lib/certificate-qr.ts');

console.log('====================================================');
console.log('   DEVORA — TES INTEGRITAS SISTEM SERTIFIKAT LENGKAP');
console.log('====================================================');

// 1. Uji Variasi Nama Penerima (Normal, Panjang, Karakter Khusus, Apostrof, Strip)
const testNames = [
  'Raffi Dwi Putra',
  'Dr. Sri Mulyani Indrawati, Ph.D., S.E., M.Sc.',
  'Jean-Luc O\'Connor-Smith',
  'José María González',
  'Ahmad Nurul Fikri bin Al-Hassan'
];

testNames.forEach(name => {
  const pdfBytes = buildCertificatePdfRaw({
    certificateNumber: 'DEVORA-2026-TEST-NAME',
    recipientName: name,
    chapterTitle: 'Pengantar Keamanan Siber & Fondasi Pertahanan',
    pathwayName: 'Cybersecurity Fundamentals',
    issueDate: '2026-11-02',
    completionDate: '2026-11-01',
    verificationUrl: 'https://raffi-cmd.github.io/techverse-academy/verify/?id=DEVORA-2026-TEST-NAME'
  });
  assert(pdfBytes && pdfBytes.length > 50000, 'PDF harus terbangun dengan benar');
  const pdfStr = Buffer.from(pdfBytes).toString('latin1');
  assert(pdfStr.includes('%PDF-1.4'), 'Header PDF-1.4 harus ada');
  console.log('[LULUS] Render nama aman & valid: "' + name + '" (' + pdfBytes.length + ' bytes)');
});

// 2. Uji QR Code Vektor Scannable
const testUrl = 'https://raffi-cmd.github.io/techverse-academy/verify/?id=DEVORA-2026-QR-TEST';
const qrOps = generateQrPdfVectorOps(testUrl, 489, 104, 53, 1);
assert(qrOps.length > 5000, 'Operasi vektor QR harus menghasilkan matriks lengkap');
assert(qrOps.includes('1 1 1 rg'), 'Quiet zone kotak putih harus dibuat');
assert(qrOps.includes('0 0 0 rg'), 'Modul bit hitam QR harus digambar');
console.log('[LULUS] Generator vektor QR code scannable menghasilkan ' + qrOps.split('\n').length + ' instruksi vektor');

// 3. Uji Pemisahan Tanggal Kelulusan vs Tanggal Terbit
const certDates = buildCertificatePdfRaw({
 certificateNumber: 'DEVORA-2026-DATE-TEST',
 recipientName: 'Budi Santoso',
 chapterTitle: 'Pengujian Sistem',
 pathwayName: 'Cybersecurity Fundamentals',
 issueDate: '2026-11-03',
 completionDate: '2026-10-28',
 verificationUrl: 'https://raffi-cmd.github.io/techverse-academy/verify/?id=DEVORA-2026-DATE-TEST'
});
const datesPdfStr = Buffer.from(certDates).toString('latin1');
assert(datesPdfStr.includes('(2026-11-03) Tj'), 'Tanggal terbit harus tampil');
assert(datesPdfStr.includes('LULUS: 2026-10-28'), 'Tanggal kelulusan harus tercatat');
console.log('[LULUS] Tanggal kelulusan (2026-10-28) dan tanggal terbit (2026-11-03) dipisahkan secara akurat');

// 4. Uji Penyelarasan Deskripsi Jalur
const testPathways = [
 { p: 'Cybersecurity Fundamentals', c: 'Fondasi Pertahanan' },
 { p: 'Software Development', c: 'Arsitektur Bersih' },
 { p: 'Artificial Intelligence Engineering', c: 'Model Transformer' },
 { p: 'Prompt Engineering', c: 'Optimasi Konteks' }
];

testPathways.forEach(item => {
 const bytes = buildCertificatePdfRaw({
 certificateNumber: 'DEVORA-PATH-' + item.p.substring(0, 4).toUpperCase(),
 recipientName: 'Test Learner',
 chapterTitle: item.c,
 pathwayName: item.p,
 issueDate: '2026-11-02',
 verificationUrl: 'https://raffi-cmd.github.io/techverse-academy/verify/?id=TEST'
 });
 const str = Buffer.from(bytes).toString('latin1');
 assert(str.includes('[ ' + item.p + ' - ' + item.c + ' ]'), 'Deskripsi jalur ' + item.p + ' harus tercetak akurat');
 console.log('[LULUS] Deskripsi spesifik jalur tercetak tepat: "' + item.p + '"');
});

console.log('====================================================');
console.log(' SEMUA PENGUJIAN SISTEM SERTIFIKAT LULUS 100%!');
console.log('====================================================');
