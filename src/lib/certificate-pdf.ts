export type CertificateType = 'CHAPTER_COMPLETION' | 'CHECKPOINT_EVALUATION' | 'TRACK_MASTERY';

export interface CertificateData {
  certificateNumber: string;
  recipientName: string;
  chapterTitle: string;
  pathwayName: string;
  issueDate: string;
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
 */
export function buildCertificatePdfRaw(data: CertificateData): string {
  const width = 841.89;
  const height = 595.28;

  const escapePdf = (str: string) => {
    return (str || '')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  };

  const recipient = escapePdf((data.recipientName || 'DEVORA LEARNER').toUpperCase());
  const chapter = escapePdf(data.chapterTitle || 'Curriculum Chapter');
  const pathway = escapePdf(data.pathwayName || 'Learning Pathway');
  const certNum = escapePdf(data.certificateNumber || 'DEVORA-CERT');
  const dateStr = escapePdf(data.issueDate || new Date().toISOString().split('T')[0]);
  const verifyUrl = escapePdf(data.verificationUrl || 'https://raffi-cmd.github.io/techverse-academy/verify/');
  const mainTitle = escapePdf(getCertificateTitle(data.type));
  const subDesc = escapePdf(getCertificateSubtext(data.type));

  const contentStream = `
q
0.031 0.043 0.078 rg
0 0 ${width} ${height} re f

0.12 0.16 0.28 RG
2 w
20 20 ${width - 40} ${height - 40} re S

0.831 0.686 0.216 RG
1.5 w
35 35 ${width - 70} ${height - 70} re S

4 w
30 30 m 50 30 l S
30 30 m 30 50 l S
${width - 30} 30 m ${width - 50} 30 l S
${width - 30} 30 m ${width - 30} 50 l S
30 ${height - 30} m 50 ${height - 30} l S
30 ${height - 30} m 30 ${height - 50} l S
${width - 30} ${height - 30} m ${width - 50} ${height - 30} l S
${width - 30} ${height - 30} m ${width - 30} ${height - 50} l S

BT
/F2 18 Tf
0.831 0.686 0.216 rg
${(width / 2) - 45} ${height - 75} Td
(DEVORA) Tj
ET

BT
/F1 8 Tf
0.7 0.75 0.85 rg
${(width / 2) - 52} ${height - 90} Td
(LEARN . BUILD . PROVE) Tj
ET

0.831 0.686 0.216 RG
1 w
${(width / 2) - 80} ${height - 98} m ${(width / 2) + 80} ${height - 98} l S

BT
/F2 22 Tf
1 1 1 rg
${Math.max(40, (width / 2) - (mainTitle.length * 6.5))} ${height - 140} Td
(${mainTitle}) Tj
ET

BT
/F1 10 Tf
0.6 0.65 0.75 rg
${(width / 2) - 70} ${height - 170} Td
(PROUDLY PRESENTED TO) Tj
ET

BT
/F2 28 Tf
0.831 0.686 0.216 rg
${Math.max(60, (width / 2) - (recipient.length * 8))} ${height - 215} Td
(${recipient}) Tj
ET

0.831 0.686 0.216 RG
0.75 w
${(width / 2) - 160} ${height - 225} m ${(width / 2) + 160} ${height - 225} l S

BT
/F1 10 Tf
0.8 0.85 0.9 rg
${Math.max(40, (width / 2) - (subDesc.length * 3.3))} ${height - 265} Td
(${subDesc}) Tj
ET

BT
/F2 17 Tf
1 1 1 rg
${Math.max(60, (width / 2) - (chapter.length * 4.8))} ${height - 302} Td
(${chapter}) Tj
ET

BT
/F1 12 Tf
0.831 0.686 0.216 rg
${Math.max(60, (width / 2) - (pathway.length * 3.8))} ${height - 330} Td
([ ${pathway} ]) Tj
ET

0.15 0.2 0.35 RG
1 w
60 135 m ${width - 60} 135 l S

BT
/F1 9 Tf
0.5 0.55 0.65 rg
70 108 Td
(ISSUE DATE:) Tj
0 -14 Td
(CERTIFICATE ID:) Tj
0 -14 Td
(VERIFICATION:) Tj
ET

BT
/F1 9 Tf
0.9 0.9 0.9 rg
175 108 Td
(${dateStr}) Tj
0 -14 Td
(${certNum}) Tj
0 -14 Td
(${verifyUrl}) Tj
ET

BT
/F2 11 Tf
1 1 1 rg
${width - 240} 108 Td
(Raffi Dwi Putra) Tj
ET

0.831 0.686 0.216 RG
1 w
${width - 250} 88 m ${width - 80} 88 l S

BT
/F1 9 Tf
0.6 0.65 0.75 rg
${width - 240} 74 Td
(Founder & Lead Architect) Tj
0 -12 Td
(DEVORA Academic Board) Tj
ET

BT
/F1 8 Tf
0.4 0.45 0.55 rg
${(width / 2) - 250} 45 Td
(Authoritative verifiable educational record issued by DEVORA. Verified at devora.academy.) Tj
ET

Q
`.trim();

  const getByteLength = (str: string) => new TextEncoder().encode(str).length;
  const streamLength = getByteLength(contentStream);

  const pdfBody = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj

2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj

3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 ${width} ${height}]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica
      >>
      /F2 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica-Bold
      >>
    >>
  >>
>>
endobj

4 0 obj
<<
  /Length ${streamLength}
>>
stream
${contentStream}
endstream
endobj
`;

  const lines = pdfBody.split('\n');
  const offsets: number[] = [0];
  let currentOffset = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^\d+ 0 obj/)) {
      offsets.push(currentOffset);
    }
    currentOffset += getByteLength(line) + 1;
  }

  const xrefOffset = getByteLength(pdfBody);

  let xref = `xref\n0 5\n0000000000 65535 f \n`;
  for (let i = 1; i <= 4; i++) {
    const off = offsets[i] || 0;
    xref += off.toString().padStart(10, '0') + ' 00000 n \n';
  }

  const trailer = `trailer
<<
  /Size 5
  /Root 1 0 R
>>
startxref
${xrefOffset}
%%EOF
`;

  return pdfBody + xref + trailer;
}

/**
 * Client-side PDF download
 */
export function downloadCertificateInBrowser(data: CertificateData): void {
  if (typeof window === 'undefined') return;
  const rawPdf = buildCertificatePdfRaw(data);
  const blob = new Blob([rawPdf], { type: 'application/pdf' });
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
 */
export function downloadCertificateImage(data: CertificateData, format: 'png' | 'jpeg' | 'jpg' = 'png'): void {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1130;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#080B14';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer Border
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  // Gold Inner Border
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

  // Gold Corners
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(50, 50); ctx.lineTo(100, 50);
  ctx.moveTo(50, 50); ctx.lineTo(50, 100);
  ctx.moveTo(canvas.width - 50, 50); ctx.lineTo(canvas.width - 100, 50);
  ctx.moveTo(canvas.width - 50, 50); ctx.lineTo(canvas.width - 50, 100);
  ctx.moveTo(50, canvas.height - 50); ctx.lineTo(100, canvas.height - 50);
  ctx.moveTo(50, canvas.height - 50); ctx.lineTo(50, canvas.height - 100);
  ctx.moveTo(canvas.width - 50, canvas.height - 50); ctx.lineTo(canvas.width - 100, canvas.height - 50);
  ctx.moveTo(canvas.width - 50, canvas.height - 50); ctx.lineTo(canvas.width - 50, canvas.height - 100);
  ctx.stroke();

  // Brand Name
  ctx.textAlign = 'center';
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('DEVORA', canvas.width / 2, 140);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('LEARN . BUILD . PROVE', canvas.width / 2, 175);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText(getCertificateTitle(data.type), canvas.width / 2, 260);

  // Presented To
  ctx.fillStyle = '#94a3b8';
  ctx.font = '18px sans-serif';
  ctx.fillText('PROUDLY PRESENTED TO', canvas.width / 2, 330);

  // Recipient
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 52px sans-serif';
  ctx.fillText((data.recipientName || 'DEVORA LEARNER').toUpperCase(), canvas.width / 2, 420);

  // Description
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '20px sans-serif';
  ctx.fillText(getCertificateSubtext(data.type), canvas.width / 2, 510);

  // Chapter
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(data.chapterTitle, canvas.width / 2, 580);

  // Pathway Badge
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 24px monospace';
  ctx.fillText(`[ ${data.pathwayName} ]`, canvas.width / 2, 630);

  // Footer line
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 800); ctx.lineTo(canvas.width - 100, 800);
  ctx.stroke();

  // Footer Left: ID & Date
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b';
  ctx.font = '16px monospace';
  ctx.fillText(`CERTIFICATE ID: ${data.certificateNumber}`, 120, 860);
  ctx.fillText(`ISSUE DATE:     ${data.issueDate}`, 120, 895);
  ctx.fillText(`VERIFY AT:      devora.academy/verify`, 120, 930);

  // Footer Right: Signature
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Raffi Dwi Putra', canvas.width - 120, 860);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px sans-serif';
  ctx.fillText('Founder & Lead Architect', canvas.width - 120, 890);
  ctx.fillText('DEVORA Academic Board', canvas.width - 120, 915);

  const mime = format === 'png' ? 'image/png' : 'image/jpeg';
  const ext = format === 'png' ? 'png' : 'jpg';
  const dataUrl = canvas.toDataURL(mime, 0.95);

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${data.certificateNumber || 'DEVORA-CERT'}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function generateCertificatePdf(data: CertificateData): Buffer {
  const rawPdf = buildCertificatePdfRaw(data);
  return Buffer.from(rawPdf, 'utf8');
}