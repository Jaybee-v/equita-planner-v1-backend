import {
  Instructor as PrismaInstructor,
  Stable as PrismaStable,
} from '@prisma/client';
import { InstructorEntity } from 'src/domain/entities/instructor.entity';
import { Gender } from 'src/domain/enums/gender.enum';
import { StableMapper } from './stable.mapper';

export class InstructorMapper {
  static toDomain(
    instructor: PrismaInstructor & { stable?: PrismaStable },
  ): InstructorEntity {
    return new InstructorEntity(
      instructor.id,
      instructor.userId,
      instructor.isIndependent,
      instructor.name,
      instructor.familyName,
      instructor.gender as Gender,
      instructor.phone,
      instructor.stableId,
      instructor.color,
      instructor.createdAt,
      instructor.updatedAt,
      instructor.stable ? StableMapper.toDomain(instructor.stable) : undefined,
    );
  }
}
