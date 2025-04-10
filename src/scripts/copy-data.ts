import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';

export function copyData() {
  const sourceDir = path.join(__dirname, '..', '..', 'src/infrastructure/data');
  const destDir = path.join(__dirname, '..', '..', 'dist/infrastructure/data');

  if (!existsSync(sourceDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  console.log('Copying data...');
  console.log(sourceDir);
  console.log(destDir);

  const files = readdirSync(sourceDir);
  files.forEach((file) => {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    copyFileSync(srcPath, destPath);
  });
  console.log('Data copied successfully');
}
