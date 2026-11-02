import certTemplateJson from './certificate-template-base64.json' with { type: 'json' };
import { generateQrPdfVectorOps, generateQrDataUrl } from './certificate-qr.ts';
const CERTIFICATE_TEMPLATE_BASE64 = certTemplateJson.base64;

export type CertificateType = 'CHAPTER_COMPLETION' | 'CHECKPOINT_EVALUATION' | 'TRACK_MASTERY';

export interface CertificateData {
  certificateNumber: string;
  recipientName: string;
  chapterTitle: string;
  pathwayName: string;
  issueDate: string;
  completionDate?: string;
  verificationUrl: string;
  type?: CertificateType;
}

export function getCertificateTitle(type?: CertificateType): string {
  switch (type) {
    case 'CHECKPOINT_EVALUATION':
      return 'MILESTONE CHECKPOINT CERTIFICATE';
    case 'TRACK_MASTERY':
      return 'CERTIFICATE OF TRACK MASTERY';
    default:
      return 'CERTIFICATE OF COMPLETION';
  }
}

export function getCertificateSubtext(type?: CertificateType): string {
  switch (type) {
    case 'CHECKPOINT_EVALUATION':
      return 'For successfully completing and mastering the 5-chapter cumulative milestone evaluation in:';
    case 'TRACK_MASTERY':
      return 'For demonstrating comprehensive mastery across all 50 curriculum chapters, checkpoints, and final practicals in:';
    default:
      return 'For successfully mastering all required curriculum chapters, practical tasks, and assessments in:';
  }
}

/**
 * Builds an authoritative PDF-1.4 binary string (landscape A4)
 * Embedding original typography, vector styling, brand accents, and verification elements.
 */
function getTemplateJpegBytes(): Uint8Array {
  const base64Clean = CERTIFICATE_TEMPLATE_BASE64.replace(/^data:image\/[a-z]+;base64,/, '');
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64Clean, 'base64');
  }
  const binaryString = atob(base64Clean);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function buildCertificatePdfRaw(data: CertificateData): Uint8Array {
  const width = 841.89;
  const height = 595.28;

  const escapePdf = (str: string) => {
    return (str || '')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  };

  const recipient = escapePdf((data.recipientName || 'Devora Learner').trim());
  const chapter = escapePdf(data.chapterTitle || 'Curriculum Chapter');
  const pathway = escapePdf(data.pathwayName || 'Learning Pathway');
  const certNum = escapePdf(data.certificateNumber || 'DEVORA-CERT');
  const dateStr = escapePdf(data.issueDate || new Date().toISOString().split('T')[0]);
  const completionDate = data.completionDate ? escapePdf(data.completionDate) : null;
  const verifyUrl = data.verificationUrl || `https://raffi-cmd.github.io/techverse-academy/verify/?id=${certNum}`;

  let nameFontSize = 30;
  if (recipient.length > 35) nameFontSize = 18;
  else if (recipient.length > 25) nameFontSize = 22;
  else if (recipient.length > 18) nameFontSize = 26;

  const estWidth = recipient.length * (nameFontSize * 0.46);
  const nameX = Math.max(340, Math.round(525 - estWidth / 2));

  const courseText = '[ ' + pathway + ' - ' + chapter + ' ]';
  const estCourseWidth = courseText.length * (10 * 0.48);
  const courseX = Math.max(330, Math.round(525 - estCourseWidth / 2));

  const dateX = 368;

  const idText = completionDate && completionDate !== dateStr
    ? 'CERTIFICATE ID: ' + certNum + '   |   LULUS: ' + completionDate
    : 'CERTIFICATE ID: ' + certNum;
  const estIdWidth = idText.length * (8 * 0.48);
  const idX = Math.max(330, Math.round(525 - estIdWidth / 2));

  // Operasi vektor QR Code scannable: diposisikan persis di atas kotak putih QR template
  // Pada PDF 841.89 x 595.28, koordinat QR: X = 489, Y = 104, Size = 53
  const qrVectorOps = generateQrPdfVectorOps(verifyUrl, 489, 104, 53, 1);

  const textStream =
    '% Brand: DEVORA - CERTIFICATE OF ACHIEVEMENT\n' +
    'q\n' +
    width.toFixed(2) + ' 0 0 ' + height.toFixed(2) + ' 0 0 cm\n' +
    '/Img1 Do\n' +
    'Q\n' +
    // Vector QR Code Scannable
    qrVectorOps +
    // Recipient Name in Rich Gold Styling
    'BT\n' +
    '/F1 ' + nameFontSize + ' Tf\n' +
    '0.96 0.82 0.32 rg\n' +
    nameX + ' 342 Td\n' +
    '(' + recipient + ') Tj\n' +
    'ET\n' +
    // Chapter / Pathway Specifier
    'BT\n' +
    '/F2 10 Tf\n' +
    '0.22 0.74 0.97 rg\n' +
    courseX + ' 248 Td\n' +
    '(' + courseText + ') Tj\n' +
    'ET\n' +
    // Issue Date in Clean Off-White
    'BT\n' +
    '/F2 10.5 Tf\n' +
    '0.96 0.98 1 rg\n' +
    dateX + ' 168 Td\n' +
    '(' + dateStr + ') Tj\n' +
    'ET\n' +
    // Certificate ID & Verification Stamp at bottom
    'BT\n' +
    '/F2 8 Tf\n' +
    '0.6 0.65 0.75 rg\n' +
    idX + ' 22 Td\n' +
    '(' + idText + ') Tj\n' +
    'ET\n';

  const textEncoder = new TextEncoder();
  const textBuf = textEncoder.encode(textStream);
  const imgBytes = getTemplateJpegBytes();

  const header = textEncoder.encode('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n');
  const offsets: number[] = [];
  let currentPos = header.length;

  const chunks: Uint8Array[] = [header];

  function pushObj(num: number, body: Uint8Array) {
    offsets.push(currentPos);
    const start = textEncoder.encode(num + ' 0 obj\n');
    const end = textEncoder.encode('\nendobj\n');
    currentPos += start.length + body.length + end.length;
    chunks.push(start, body, end);
  }

  pushObj(1, textEncoder.encode('<< /Type /Catalog /Pages 2 0 R >>'));
  pushObj(2, textEncoder.encode('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'));
  pushObj(
    3,
    textEncoder.encode(
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' +
        width.toFixed(2) +
        ' ' +
        height.toFixed(2) +
        '] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> /XObject << /Img1 7 0 R >> >> >>'
    )
  );

  const sStart = textEncoder.encode('<< /Length ' + textBuf.length + ' >>\nstream\n');
  const sEnd = textEncoder.encode('\nendstream');
  const streamBody = new Uint8Array(sStart.length + textBuf.length + sEnd.length);
  streamBody.set(sStart, 0);
  streamBody.set(textBuf, sStart.length);
  streamBody.set(sEnd, sStart.length + textBuf.length);
  pushObj(4, streamBody);

  pushObj(5, textEncoder.encode('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>'));
  pushObj(6, textEncoder.encode('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'));

  const imgHeader = textEncoder.encode(
    '<< /Type /XObject /Subtype /Image /Width 1024 /Height 838 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' +
      imgBytes.length +
      ' >>\nstream\n'
  );
  const imgFooter = textEncoder.encode('\nendstream');
  const imgObjBody = new Uint8Array(imgHeader.length + imgBytes.length + imgFooter.length);
  imgObjBody.set(imgHeader, 0);
  imgObjBody.set(imgBytes, imgHeader.length);
  imgObjBody.set(imgFooter, imgHeader.length + imgBytes.length);
  pushObj(7, imgObjBody);

  const xrefPos = currentPos;
  let xrefStr = 'xref\n0 8\n0000000000 65535 f \n';
  for (const off of offsets) {
    xrefStr += off.toString().padStart(10, '0') + ' 00000 n \n';
  }
  xrefStr += 'trailer\n<< /Size 8 /Root 1 0 R >>\nstartxref\n' + xrefPos + '\n%%EOF\n';
  chunks.push(textEncoder.encode(xrefStr));

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const finalPdf = new Uint8Array(totalLength);
  let writeOffset = 0;
  for (const chunk of chunks) {
    finalPdf.set(chunk, writeOffset);
    writeOffset += chunk.length;
  }

  return finalPdf;
}

/**
 * Client-side PDF download
 */
export function downloadCertificateInBrowser(data: CertificateData): void {
  if (typeof window === 'undefined') return;
  const rawPdf = buildCertificatePdfRaw(data);
  const blob = new Blob([rawPdf as any], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.certificateNumber || 'DEVORA-CERT'}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Client-side Image (PNG/JPG) download helper using HTML5 Canvas
 * Faithful reproduction of the Original Devora Template uploaded by User:
 * Navy background with gold curves, DEVORA logo, Congratulations ribbon seal,
 * CERTIFICATE OF ACHIEVEMENT title, PROUDLY PRESENTED TO, Recipient name,
 * dynamic description, Date, QR code, and Raffi dwi putra signature.
 */
export async function downloadCertificateImage(
  data: CertificateData,
  format: 'png' | 'jpeg' | 'jpg' = 'png'
): Promise<void> {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  const width = 1600;
  const height = 1309; // rasio persis template 1024 x 838
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const verifyUrl = data.verificationUrl || `https://raffi-cmd.github.io/techverse-academy/verify/?id=${data.certificateNumber}`;
  const qrDataUrl = await generateQrDataUrl(verifyUrl, 256);

  const img = new Image();
  img.crossOrigin = 'anonymous';

  const renderOverlays = () => {
    // 1. Gambar QR Code scannable dinamis di atas kotak QR template
    // Template 1024x838: X: 595 - 659, Y: 647 - 711
    // Canvas 1600x1309: X = 595 * (1600/1024) = 930, Y = 647 * (1309/838) = 1010, Size = 100
    if (qrDataUrl) {
      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 930, 1010, 100, 100);
        finishDownload();
      };
      qrImg.onerror = () => finishDownload();
      qrImg.src = qrDataUrl;
    } else {
      finishDownload();
    }
  };

  const finishDownload = () => {
    // 2. Recipient Name: Terletak di antara PROUDLY PRESENTED TO dan garis emas
    // Menggunakan font kaligrafi dan warna gradasi emas sesuai gambar referensi pengguna
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const recipient = (data.recipientName || 'Devora Learner').trim();

    // Ukuran font adaptif untuk kaligrafi
    let fontSize = 56;
    if (recipient.length > 35) fontSize = 34;
    else if (recipient.length > 25) fontSize = 42;
    else if (recipient.length > 18) fontSize = 48;

    ctx.font = `${fontSize}px "Great Vibes", "Brush Script MT", "Times New Roman", cursive`;
    
    // Efek bayangan halus
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;

    // Warna emas mewah sesuai referensi
    const grad = ctx.createLinearGradient(800, 500, 1200, 560);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.5, '#facc15');
    grad.addColorStop(1, '#eab308');
    ctx.fillStyle = grad;
    ctx.fillText(recipient, 1024, 532);

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // 3. Program & Bab
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px sans-serif';
    const courseText = `[ ${data.pathwayName} — ${data.chapterTitle} ]`;
    ctx.fillText(courseText, 1024, 792);

    // 4. Tanggal Terbit di atas garis DATE
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 23px monospace';
    const issueDateStr = data.issueDate || new Date().toISOString().split('T')[0];
    ctx.fillText(issueDateStr, 712, 936);

    // 5. Certificate ID di dasar sertifikat
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 15px monospace';
    const idInfo = data.completionDate && data.completionDate !== issueDateStr
      ? `CERTIFICATE ID: ${data.certificateNumber}  |  LULUS: ${data.completionDate}`
      : `CERTIFICATE ID: ${data.certificateNumber}`;
    ctx.fillText(idInfo, 1024, 1263);

    // Trigger download
    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const ext = format === 'png' ? 'png' : 'jpg';
    const dataUrl = canvas.toDataURL(mime, 0.95);

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${data.certificateNumber || 'DEVORA-CERT'}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height);
    renderOverlays();
  };

  img.onerror = () => {
    ctx.fillStyle = '#050c1e';
    ctx.fillRect(0, 0, width, height);
    renderOverlays();
  };

  img.src = CERTIFICATE_TEMPLATE_BASE64;
}

export function generateCertificatePdf(data: CertificateData): Buffer {
  const rawPdf = buildCertificatePdfRaw(data);
  return Buffer.from(rawPdf.buffer as ArrayBuffer);
}