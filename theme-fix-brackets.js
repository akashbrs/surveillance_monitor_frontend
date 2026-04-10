import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
        walkDir(dirPath, callback);
    } else {
        callback(dirPath);
    }
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Pattern 1: prefix-gray-900 dark:prefix-white/[0.xx] 
    // -> prefix-gray-900/[0.xx] dark:prefix-white/[0.xx]
    content = content.replace(/(bg|text|border|ring)-gray-900 dark:\1-white(\/\[[0-9\.]+\])/g, (match, prefix, opacity) => {
        return `${prefix}-gray-900${opacity} dark:${prefix}-white${opacity}`;
    });

    // Pattern 2: prefix-white dark:prefix-gray-(900|950)/[0.xx]
    // -> prefix-white/[0.xx] dark:prefix-gray-$2/[0.xx]
    content = content.replace(/(bg|text|border|ring)-white dark:\1-gray-(900|950)(\/\[[0-9\.]+\])/g, (match, prefix, color, opacity) => {
        return `${prefix}-white${opacity} dark:${prefix}-gray-${color}${opacity}`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed bracket opacities in ${filePath}`);
    }
  }
});
