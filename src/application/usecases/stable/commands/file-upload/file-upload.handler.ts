import { Inject, Injectable } from '@nestjs/common';
import { IMulterService } from 'src/domain/interfaces/services/multer.service';
import { FileUploadCommand } from './file-upload.command';

@Injectable()
export class FileUploadHandler {
  constructor(
    @Inject('IMulterService')
    private readonly multerService: IMulterService,
  ) {}

  async execute(command: FileUploadCommand): Promise<string> {
    return await this.multerService.saveFile(command.file, command.type);
  }
}
