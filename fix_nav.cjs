const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/screens/VerifyEmployee.tsx',
  'src/screens/Login.tsx',
  'src/screens/EmployeeProfile.tsx',
  'src/screens/AnalyticsPage.tsx'
];

for (const file of filesToFix) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('navigate(')) {
      content = content.replace(/navigate\(/g, 'router.push(');
      fs.writeFileSync(fullPath, content);
      console.log('Fixed', fullPath);
    }
  }
}
