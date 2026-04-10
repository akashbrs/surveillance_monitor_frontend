import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/(text|bg|border|ring)-(white|black)(?:\/([0-9\.]+))?/g, (match, prefix, color, opacity) => {
      let newColor = color === 'white' ? 'gray-900' : 'white';
      
      let res = `${prefix}-${newColor}`;
      if (opacity) {
        res += `/${opacity}`;
      }
      return res;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
});
