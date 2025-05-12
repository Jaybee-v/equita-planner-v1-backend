import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import * as path from 'path';

export function copyTemplates() {
  const sourceDir = path.join(
    __dirname,
    '..',
    '..',
    'src/infrastructure/email/templates',
  );
  const destDir = path.join(
    __dirname,
    '..',
    '..',
    'dist/infrastructure/email/templates',
  );

  // Créer le dossier de destination s'il n'existe pas
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  // Copier tous les fichiers du dossier source vers le dossier de destination
  const files = readdirSync(sourceDir);
  files.forEach((file) => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    copyFileSync(sourcePath, destPath);
  });

  console.log('Templates email copiés avec succès');
}
