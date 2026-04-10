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

    // We only want to add dark: classes if they aren't already there.
    // Replace text-gray-900 with text-gray-900 dark:text-white
    content = content.replace(/(?<!dark:)text-gray-900(\/[0-9.]+)?/g, (match, op) => {
        return `text-gray-900${op || ''} dark:text-white${op || ''}`;
    });

    // Replace bg-white with bg-white dark:bg-gray-950
    // But exclude cases where it's already got a dark: variant right after
    content = content.replace(/(?<!dark:)bg-white(\/[0-9.]+)?(?! dark:bg-)/g, (match, op) => {
        // If it was white, in dark theme it should probably be dark gray/black
        return `bg-white${op || ''} dark:bg-gray-950${op || ''}`;
    });

    // Replace bg-gray-900 with bg-gray-900 dark:bg-white
    content = content.replace(/(?<!dark:)bg-gray-900(\/[0-9.]+)?(?! dark:bg-)/g, (match, op) => {
        return `bg-gray-900${op || ''} dark:bg-white${op || ''}`;
    });

    // Replace border-gray-900 with border-gray-900 dark:border-white
    content = content.replace(/(?<!dark:)border-gray-900(\/[0-9.]+)?(?! dark:border-)/g, (match, op) => {
        return `border-gray-900${op || ''} dark:border-white${op || ''}`;
    });

    // Replace ring-gray-900 with ring-gray-900 dark:ring-white
    content = content.replace(/(?<!dark:)ring-gray-900(\/[0-9.]+)?(?! dark:ring-)/g, (match, op) => {
        return `ring-gray-900${op || ''} dark:ring-white${op || ''}`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Restored dark modes in ${filePath}`);
    }
  }
});
