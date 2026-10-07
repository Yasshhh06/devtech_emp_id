const fs = require('fs');
const path = require('path');

const dirsToProcess = [
  'app',
  'src/screens',
  'src/components',
  'src/context',
  'src/hooks',
  'src/services'
];

function processDir(dir) {
  const fullDir = path.join(__dirname, dir);
  if (!fs.existsSync(fullDir)) return;
  
  const files = fs.readdirSync(fullDir);
  for (const file of files) {
    const fullPath = path.join(fullDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(path.join(dir, file));
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      // Don't add to layout.tsx or next.config etc if we don't want, but for app/ pages it's mostly pages.
      // Actually app/layout.tsx should NOT have "use client" if it has metadata.
      if (fullPath.endsWith('layout.tsx') && dir === 'app') continue; 
      // page.tsx in app/(protected) needs "use client"? 
      // If we just add it to all screens/components/context/hooks/services, 
      // the app/ pages just import those screens and render them. Wait, app/ pages just do:
      // import { AnalyticsPage } from '@/screens/AnalyticsPage';
      // export default function Page() { return <AnalyticsPage />; }
      // So the app/ pages can remain Server Components, as long as the screens they import have "use client"!
      
      if (dir.startsWith('app')) continue; // Skip app directory entirely

      let content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('"use client"') && !content.includes("'use client'")) {
        content = '"use client";\n' + content;
        fs.writeFileSync(fullPath, content);
        console.log('Added use client to', fullPath);
      }
    }
  }
}

for (const dir of dirsToProcess) {
  processDir(dir);
}
