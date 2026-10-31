const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, '..', 'public', 'certificates', 'devora-certificate-template.jpg');
const buf = fs.readFileSync(imgPath);
const b64 = buf.toString('base64');

const outPathJson = path.join(__dirname, '..', 'src', 'lib', 'certificate-template-base64.json');
fs.writeFileSync(outPathJson, JSON.stringify({
  base64: `data:image/jpeg;base64,${b64}`,
  rawBase64: b64
}, null, 2), 'utf8');

console.log('Successfully generated src/lib/certificate-template-base64.json, size:', fs.statSync(outPathJson).size);
