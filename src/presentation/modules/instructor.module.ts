import { forwardRef, Module } from '@nestjs/common';
import { CreateInstructorHandler } from 'src/application/usecases/instructor/commands/create-instructor/create-instructor.handler';
import { CreateStableInstructorHandler } from 'src/application/usecases/stable/commands/create-instructor/create-instructor.handler';
import { PrismaService } from 'src/infrastructure/config/prisma.service';
import { InstructorRepository } from 'src/infrastructure/persistence/instructor.repository';
import { InstructorController } from '../controllers/instructor.controller';
import { StableModule } from './stable.module';
import { UserModule } from './user.module';

@Module({
  imports: [forwardRef(() => UserModule), StableModule],
  controllers: [InstructorController],
  providers: [
    CreateInstructorHandler,
    CreateStableInstructorHandler,
    { provide: 'IInstructorRepository', useClass: InstructorRepository },
    PrismaService,
  ],
  exports: ['IInstructorRepository'],
})
export class InstructorModule {}
