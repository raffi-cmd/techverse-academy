import certTemplateJson from './certificate-template-base64.json' with { type: 'json' };
const CERTIFICATE_TEMPLATE_BASE64 = certTemplateJson.base64;

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
 * Embedding original typography, vector styling, brand accents, and verification elements.
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
% Background: Deep Navy
0.031 0.043 0.078 rg
0 0 ${width} ${height} re f

% Left Wave Arch Accent Background (Navy to Electric Blue)
0.05 0.09 0.22 rg
0 0 240 ${height} re f

% Outer Dark Accent Border
0.12 0.16 0.28 RG
2 w
20 20 ${width - 40} ${height - 40} re S

% Gold Border: #D4AF37 (0.831, 0.686, 0.216)
0.831 0.686 0.216 RG
1.5 w
35 35 ${width - 70} ${height - 70} re S

% Left Curved Decorative Gold Lines
0.831 0.686 0.216 RG
3 w
230 0 m 250 180 220 400 240 ${height} c S

% Left Column: Brand & Logo Block
BT
/F2 26 Tf
0.831 0.686 0.216 rg
55 ${height - 120} Td
(DEVORA) Tj
ET

BT
/F1 9 Tf
0.7 0.8 0.95 rg
55 ${height - 138} Td
(Learn. Build. Prove.) Tj
ET

% Left Column: Congratulations Gold Seal
0.831 0.686 0.216 RG
2 w
110 ${height - 240} 45 0 360 arc S
0.831 0.686 0.216 rg
110 ${height - 240} 40 0 360 arc f

BT
/F2 9 Tf
0.031 0.043 0.078 rg
75 ${height - 243} Td
(CONGRATULATIONS) Tj
ET

% Right Main Area: Heading "CERTIFICATE OF ACHIEVEMENT"
BT
/F2 36 Tf
0.831 0.686 0.216 rg
360 ${height - 120} Td
(CERTIFICATE) Tj
ET

BT
/F2 16 Tf
1 1 1 rg
365 ${height - 150} Td
(OF ACHIEVEMENT) Tj
ET

% Subheading: PROUDLY PRESENTED TO
BT
/F1 12 Tf
0.75 0.8 0.9 rg
410 ${height - 200} Td
(PROUDLY PRESENTED TO) Tj
ET

% Recipient Name (Large, White/Gold)
BT
/F2 28 Tf
1 1 1 rg
${Math.max(300, 560 - (recipient.length * 8))} ${height - 250} Td
(${recipient}) Tj
ET

% Underline below recipient name
0.831 0.686 0.216 RG
1 w
350 ${height - 265} m 760 ${height - 265} l S

% Recognition Statement
BT
/F1 10 Tf
0.75 0.8 0.9 rg
330 ${height - 305} Td
(In recognition of your dedication, hard work, and outstanding performance) Tj
0 -15 Td
(in completing the learning program at Devora. Your commitment to learn, build,) Tj
0 -15 Td
(and prove has shown great potential and made a positive impact in our community.) Tj
ET

% Program & Chapter Specifier
BT
/F2 13 Tf
0.831 0.686 0.216 rg
330 ${height - 370} Td
(Program: ) Tj
ET

BT
/F2 13 Tf
1 1 1 rg
390 ${height - 370} Td
(${chapter}  [ ${pathway} ]) Tj
ET

% Bottom Section Dividers and Signatures
0.831 0.686 0.216 RG
1 w
350 140 m 500 140 l S
590 140 m 770 140 l S

% Date Label
BT
/F1 9 Tf
0.6 0.65 0.75 rg
405 120 Td
(DATE) Tj
ET

BT
/F2 10 Tf
1 1 1 rg
380 150 Td
(${dateStr}) Tj
ET

% QR Code Placeholder Box & Verification text
0.831 0.686 0.216 RG
1 w
520 115 45 45 re S

BT
/F1 7 Tf
0.7 0.75 0.85 rg
515 98 Td
(VERIFIED) Tj
ET

% Signature Label & Signatory
BT
/F2 16 Tf
0.831 0.686 0.216 rg
630 150 Td
(Raffi dwi putra) Tj
ET

BT
/F1 9 Tf
0.6 0.65 0.75 rg
650 120 Td
(SIGNATURE) Tj
ET

% Certificate ID & Verification URL
BT
/F1 8 Tf
0.5 0.55 0.65 rg
350 65 Td
(Certificate ID: ${certNum}   |   Verification: ${verifyUrl}) Tj
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
    currentOffset += getByteLength(line) + 1; // +1 for \n
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
 * Faithful reproduction of the Original Devora Template uploaded by User:
 * Navy background with gold curves, DEVORA logo, Congratulations ribbon seal,
 * CERTIFICATE OF ACHIEVEMENT title, PROUDLY PRESENTED TO, Recipient name,
 * dynamic description, Date, QR code, and Raffi dwi putra signature.
 */
export function downloadCertificateImage(
  data: CertificateData,
  format: 'png' | 'jpeg' | 'jpg' = 'png'
): void {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  const width = 1600;
  const height = 1309; // exact aspect ratio of 1024 x 838 template
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  img.crossOrigin = 'anonymous';

  const renderOverlays = () => {
    // 1. Draw Recipient Name (Centered over recipient area)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px serif';
    const recipient = (data.recipientName || 'DEVORA LEARNER').toUpperCase();
    ctx.fillText(recipient, 1025, 500);

    // 2. Specific Chapter & Pathway line
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 20px sans-serif';
    const courseText = `[ ${data.pathwayName} — ${data.chapterTitle} ]`;
    ctx.fillText(courseText, 1025, 775);

    // 3. Dynamic Date
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(data.issueDate || new Date().toISOString().split('T')[0], 765, 795);

    // 4. Certificate ID stamp
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`CERTIFICATE ID: ${data.certificateNumber}`, 1025, 1260);

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
    // Fallback if background image fails
    ctx.fillStyle = '#050c1e';
    ctx.fillRect(0, 0, width, height);
    renderOverlays();
  };

  img.src = CERTIFICATE_TEMPLATE_BASE64;
}

export function generateCertificatePdf(data: CertificateData): Buffer {
  const rawPdf = buildCertificatePdfRaw(data);
  return Buffer.from(rawPdf, 'utf8');
}