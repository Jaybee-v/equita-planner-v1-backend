import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import path from 'path';
import { ImportFileType } from 'src/domain/enums/import-file-type.enum';
import { IMulterService } from 'src/domain/interfaces/services/multer.service';

export type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer: Buffer;
};

@Injectable()
export class MulterService implements IMulterService {
  private readonly uploadDir = 'uploads';

  async saveFile(file: MulterFile, type: ImportFileType): Promise<string> {
    if (!file || !file.buffer || !file.originalname) {
      throw new Error('Aucun fichier téléchargé');
    }

    const typeDir = path.join(this.uploadDir, type);
    await this.ensureDirectoryExists(typeDir);
    const fileExtension = path.extname(file.originalname);
    const fileName = `${type}-${crypto.randomUUID()}${fileExtension}`;
    const filePath = path.join(typeDir, fileName);
    await fs.writeFile(filePath, file.buffer);
    return `/${path.join(this.uploadDir, type, fileName)}`;
  }

  private async ensureDirectoryExists(directory: string): Promise<void> {
    try {
      await fs.access(directory);
    } catch {
      await fs.mkdir(directory, { recursive: true });
    }
  }
}
