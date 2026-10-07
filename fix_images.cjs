const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/screens/VerifyEmployee.tsx',
  'src/screens/Login.tsx',
  'src/components/layout/Sidebar.tsx',
  'src/components/cards/InternHorizontalCard.tsx',
  'src/components/cards/Fortune500HorizontalCard.tsx'
];

for (const file of filesToFix) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('src={devtechLogo}')) {
      content = content.replace(/src={devtechLogo}/g, 'src={devtechLogo.src}');
      fs.writeFileSync(fullPath, content);
      console.log('Fixed', fullPath);
    }
  }
}
