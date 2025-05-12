import { ImportFileType } from 'src/domain/enums/import-file-type.enum';
import { MulterFile } from 'src/infrastructure/services/multer.service';

export interface IMulterService {
  saveFile(file: MulterFile, type: ImportFileType): Promise<string>;
}
