import { ImportFileType } from 'src/domain/enums/import-file-type.enum';
import { MulterFile } from 'src/infrastructure/services/multer.service';

export class FileUploadCommand {
  constructor(
    public readonly file: MulterFile,
    public readonly type: ImportFileType,
  ) {}
}
