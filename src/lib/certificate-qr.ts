import QRCode from 'qrcode';

/**
 * Menghasilkan operasi vektor PDF untuk menggambar QR code pada koordinat tertentu
 */
export function generateQrPdfVectorOps(
  text: string,
  x: number,
  y: number,
  sizePx: number,
  marginModules = 1
): string {
  try {
    const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
    const moduleCount = qr.modules.size;
    const data = qr.modules.data;
    const totalModules = moduleCount + marginModules * 2;
    const modSize = sizePx / totalModules;

    let ops = '';
    // Kotak latar belakang putih bersih (quiet zone)
    ops += '1 1 1 rg\n';
    ops += `${x.toFixed(2)} ${y.toFixed(2)} ${sizePx.toFixed(2)} ${sizePx.toFixed(2)} re f\n`;

    // Modul hitam QR
    ops += '0 0 0 rg\n';
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (data[r * moduleCount + c]) {
          const mx = x + (c + marginModules) * modSize;
          const my = y + (moduleCount - 1 - r + marginModules) * modSize;
          ops += `${mx.toFixed(2)} ${my.toFixed(2)} ${modSize.toFixed(2)} ${modSize.toFixed(2)} re f\n`;
        }
      }
    }
    return ops;
  } catch (err) {
    console.error('Error generating QR vector ops for PDF:', err);
    return '';
  }
}

/**
 * Menghasilkan data URL QR code untuk browser canvas / web image
 */
export async function generateQrDataUrl(text: string, width = 128): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Error generating QR data url:', err);
    return '';
  }
}
