const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Replace useNavigate -> useRouter
      if (content.includes('useNavigate')) {
        content = content.replace(/useNavigate/g, 'useRouter');
        content = content.replace(/const navigate = useRouter\(\);/g, 'const router = useRouter();');
        content = content.replace(/navigate\(/g, 'router.push(');
        changed = true;
      }
      
      // Replace NavLink -> Link and usePathname
      if (content.includes('NavLink')) {
        content = content.replace(/NavLink/g, 'Link');
        // also need to import usePathname
        if (!content.includes('usePathname')) {
          content = content.replace(/import \{.*?\} from 'next\/navigation';/, match => {
            return match.replace('}', ', usePathname }');
          });
        }
        changed = true;
      }

      // Replace react-router-dom imports
      if (content.includes('react-router-dom')) {
        content = content.replace(/'react-router-dom'/g, "'next/navigation'");
        changed = true;
      }
      
      // In Sidebar.tsx, NavLink had isActive render prop. In Next.js, we usePathname().
      if (fullPath.includes('Sidebar.tsx')) {
        content = content.replace(/import { Link, useRouter } from 'next\/navigation';/, "import Link from 'next/link';\nimport { useRouter, usePathname } from 'next/navigation';");
        // We will manually fix Sidebar.tsx afterwards if needed
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
