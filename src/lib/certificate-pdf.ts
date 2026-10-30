export interface CertificateData {
  certificateNumber: string;
  recipientName: string;
  chapterTitle: string;
  pathwayName: string;
  issueDate: string;
  verificationUrl: string;
}

/**
 * Generates an authoritative, professional, landscape A4 PDF certificate
 * styled in dark navy (#080B14) with gold (#D4AF37) and white typography,
 * geometric borders, medallion accents, and verification credentials.
 * Follows strict PDF-1.4 standard and is 100% browser/Node compatible.
 */
export function buildCertificatePdfRaw(data: CertificateData): string {
  // Landscape A4: 841.89 pt x 595.28 pt
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

  const contentStream = `
q
% Background: Deep Navy (#080B14)
0.031 0.043 0.078 rg
0 0 ${width} ${height} re f

% Outer Dark Accent Border
0.12 0.16 0.28 RG
2 w
20 20 ${width - 40} ${height - 40} re S

% Gold Border: #D4AF37 (0.831, 0.686, 0.216)
0.831 0.686 0.216 RG
1.5 w
35 35 ${width - 70} ${height - 70} re S

% Corner decorative gold accents
4 w
30 30 m 50 30 l S
30 30 m 30 50 l S
${width - 30} 30 m ${width - 50} 30 l S
${width - 30} 30 m ${width - 30} 50 l S
30 ${height - 30} m 50 ${height - 30} l S
30 ${height - 30} m 30 ${height - 50} l S
${width - 30} ${height - 30} m ${width - 50} ${height - 30} l S
${width - 30} ${height - 30} m ${width - 30} ${height - 50} l S

% Brand Header: DEVORA
BT
/F2 18 Tf
0.831 0.686 0.216 rg
${(width / 2) - 45} ${height - 75} Td
(DEVORA) Tj
ET

% Tagline: LEARN. BUILD. PROVE.
BT
/F1 8 Tf
0.7 0.75 0.85 rg
${(width / 2) - 52} ${height - 90} Td
(LEARN . BUILD . PROVE) Tj
ET

% Decorative Gold Line below brand
0.831 0.686 0.216 RG
1 w
${(width / 2) - 80} ${height - 98} m ${(width / 2) + 80} ${height - 98} l S

% Main Title: CERTIFICATE OF COMPLETION
BT
/F2 24 Tf
1 1 1 rg
${(width / 2) - 190} ${height - 140} Td
(CERTIFICATE OF COMPLETION) Tj
ET

% Subtitle: PROUDLY PRESENTED TO
BT
/F1 10 Tf
0.6 0.65 0.75 rg
${(width / 2) - 70} ${height - 170} Td
(PROUDLY PRESENTED TO) Tj
ET

% Recipient Name (Large, Gold/White)
BT
/F2 28 Tf
0.831 0.686 0.216 rg
${Math.max(60, (width / 2) - (recipient.length * 8))} ${height - 215} Td
(${recipient}) Tj
ET

% Name underline
0.831 0.686 0.216 RG
0.75 w
${(width / 2) - 160} ${height - 225} m ${(width / 2) + 160} ${height - 225} l S

% Description
BT
/F1 11 Tf
0.8 0.85 0.9 rg
${(width / 2) - 220} ${height - 265} Td
(For successfully mastering all required curriculum chapters, practical tasks, and assessments in:) Tj
ET

% Chapter Title
BT
/F2 17 Tf
1 1 1 rg
${Math.max(60, (width / 2) - (chapter.length * 4.8))} ${height - 302} Td
(${chapter}) Tj
ET

% Pathway Name Badge
BT
/F1 12 Tf
0.831 0.686 0.216 rg
${Math.max(60, (width / 2) - (pathway.length * 3.8))} ${height - 330} Td
([ ${pathway} ]) Tj
ET

% Footer Divider
0.15 0.2 0.35 RG
1 w
60 135 m ${width - 60} 135 l S

% Footer Left: Date & Certificate ID
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

% Footer Right: Signatures
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

% Bottom Legal Disclaimer
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
 * Client-side browser download helper
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
 * Server-side / Node.js Buffer export helper
 */
export function generateCertificatePdf(data: CertificateData): Buffer {
  const rawPdf = buildCertificatePdfRaw(data);
  return Buffer.from(rawPdf, 'utf8');
}
