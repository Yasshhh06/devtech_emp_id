const fs = require('fs');
const path = require('path');

const filesToFix = [
  {
    path: 'src/context/ThemeContext.tsx',
    replace: [
      [/return window\.matchMedia/g, "return typeof window !== 'undefined' && window.matchMedia"]
    ]
  },
  {
    path: 'src/screens/EmployeeProfile.tsx',
    replace: [
      [/\$\{window\.location\.origin\}/g, "${typeof window !== 'undefined' ? window.location.origin : ''}"]
    ]
  },
  {
    path: 'src/components/cards/InteractiveBadgePreview.tsx',
    replace: [
      [/\$\{window\.location\.origin\}/g, "${typeof window !== 'undefined' ? window.location.origin : ''}"]
    ]
  },
  {
    path: 'src/components/cards/InternInteractiveBadgePreview.tsx',
    replace: [
      [/\$\{window\.location\.origin\}/g, "${typeof window !== 'undefined' ? window.location.origin : ''}"]
    ]
  },
];

for (const { path: file, replace } of filesToFix) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;
    for (const [regex, replacer] of replace) {
      if (content.match(regex)) {
        content = content.replace(regex, replacer);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(fullPath, content);
      console.log('Fixed', fullPath);
    }
  }
}
