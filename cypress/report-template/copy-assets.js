/**
 * Cross-platform asset copy script
 * Copies screenshots and videos to report directory
 */

const fs = require('fs');
const path = require('path');

const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) {
    console.log(`⚠️  Source directory not found: ${src} (skipping)`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  console.log(`✅ Copied: ${src} -> ${dest}`);
};

const reportDir = 'cypress/results/report';

// Ensure report directory exists
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

// Copy screenshots if they exist
copyDir('cypress/screenshots', path.join(reportDir, 'screenshots'));

// Copy videos if they exist
copyDir('cypress/videos', path.join(reportDir, 'videos'));

console.log('✅ Asset copy completed!');
