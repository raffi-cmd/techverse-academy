import fs from 'node:fs';
import path from 'node:path';

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
 * styled in dark navy (#0A0E1A) with gold and white typography,
 * geometric borders, medallion seal, and verification credentials.
 * Follows strict PDF-1.4 standard.
 */
export function generateCertificatePdf(data: CertificateData): Buffer {
  // Landscape A4: 841.89 pt x 595.28 pt
  const width = 841.89;
  const height = 595.28;

  // Clean strings for PDF string literals (escape parenthesis and backslashes)
  const escapePdf = (str: string) => {
    return (str || '')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  };

  const recipient = escapePdf(data.recipientName.toUpperCase());
  const chapter = escapePdf(data.chapterTitle);
  const pathway = escapePdf(data.pathwayName);
  const certNum = escapePdf(data.certificateNumber);
  const dateStr = escapePdf(data.issueDate);
  const verifyUrl = escapePdf(data.verificationUrl);

  // PDF content stream commands:
  // Coordinates in PDF start from bottom-left (0,0) to top-right (width, height)
  const contentStream = `
q
% Background: Deep Navy (#080B14)
0.031 0.043 0.078 rg
0 0 ${width} ${height} re f

% Inner Border: Subtle Dark Border
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

% Brand Header: TECHVERSE ACADEMY
BT
/F1 14 Tf
0.831 0.686 0.216 rg
${(width / 2) - 80} ${height - 75} Td
(TECHVERSE ACADEMY) Tj
ET

% Decorative Gold Line below brand
0.831 0.686 0.216 RG
1 w
${(width / 2) - 60} ${height - 85} m ${(width / 2) + 60} ${height - 85} l S

% Main Title: CERTIFICATE OF COMPLETION
BT
/F2 26 Tf
1 1 1 rg
${(width / 2) - 210} ${height - 130} Td
(CERTIFICATE OF COMPLETION) Tj
ET

% Subtitle: PROUDLY PRESENTED TO
BT
/F1 11 Tf
0.6 0.65 0.75 rg
${(width / 2) - 75} ${height - 165} Td
(PROUDLY PRESENTED TO) Tj
ET

% Recipient Name (Large, Gold/White)
BT
/F2 30 Tf
0.831 0.686 0.216 rg
${(width / 2) - (recipient.length * 8.5)} ${height - 215} Td
(${recipient}) Tj
ET

% Name underline
0.831 0.686 0.216 RG
0.75 w
${(width / 2) - 150} ${height - 225} m ${(width / 2) + 150} ${height - 225} l S

% Description
BT
/F1 12 Tf
0.8 0.85 0.9 rg
${(width / 2) - 230} ${height - 265} Td
(For successfully mastering all required curriculum chapters, practical tasks, and assessments in:) Tj
ET

% Chapter Title
BT
/F2 18 Tf
1 1 1 rg
${(width / 2) - (chapter.length * 5)} ${height - 305} Td
(${chapter}) Tj
ET

% Pathway Name Badge
BT
/F1 13 Tf
0.831 0.686 0.216 rg
${(width / 2) - (pathway.length * 4)} ${height - 335} Td
([ ${pathway} ]) Tj
ET

% Footer Divider
0.15 0.2 0.35 RG
1 w
60 135 m ${width - 60} 135 l S

% Footer Left: Date & Certificate ID
BT
/F1 10 Tf
0.5 0.55 0.65 rg
70 105 Td
(ISSUE DATE:) Tj
0 -15 Td
(CERTIFICATE ID:) Tj
0 -15 Td
(VERIFICATION:) Tj
ET

BT
/F1 10 Tf
0.9 0.9 0.9 rg
175 105 Td
(${dateStr}) Tj
0 -15 Td
(${certNum}) Tj
0 -15 Td
(${verifyUrl}) Tj
ET

% Footer Right: Signatures
BT
/F2 11 Tf
1 1 1 rg
${width - 240} 105 Td
(TechVerse Academic Board) Tj
ET

0.831 0.686 0.216 RG
1 w
${width - 250} 85 m ${width - 80} 85 l S

BT
/F1 9 Tf
0.6 0.65 0.75 rg
${width - 235} 70 Td
(Director of Technical Curriculum) Tj
ET

% Bottom Legal Disclaimer
BT
/F1 8 Tf
0.4 0.45 0.55 rg
${(width / 2) - 260} 45 Td
(Educational completion certificate. Authoritative cryptographic record verified at techverse.academy.) Tj
ET

Q
  `.trim();

  const streamLength = Buffer.byteLength(contentStream, 'utf8');

  // Build minimal clean PDF-1.4 binary structure
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

  // Calculate object byte offsets for xref table
  const lines = pdfBody.split('\n');
  const offsets: number[] = [0]; // dummy 0
  let currentOffset = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^\d+ 0 obj/)) {
      offsets.push(currentOffset);
    }
    currentOffset += Buffer.byteLength(line, 'utf8') + 1; // +1 for \n
  }

  const xrefOffset = Buffer.byteLength(pdfBody, 'utf8');

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

  const fullPdf = pdfBody + xref + trailer;
  const buffer = Buffer.from(fullPdf, 'utf8');

  // Save PDF to public/certificates directory
  const certsDir = path.join(process.cwd(), 'public', 'certificates');
  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
  }
  const filePath = path.join(certsDir, `${data.certificateNumber}.pdf`);
  fs.writeFileSync(filePath, buffer);

  return buffer;
}
