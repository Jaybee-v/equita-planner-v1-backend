import { Injectable } from '@nestjs/common';
import { InstructorEntity } from 'src/domain/entities/instructor.entity';
import { IInstructorRepository } from 'src/domain/interfaces/instructor.repository';
import { PrismaService } from '../config/prisma.service';
import { InstructorMapper } from '../mappers/instructor.mapper';

@Injectable()
export class InstructorRepository implements IInstructorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(instructor: InstructorEntity): Promise<InstructorEntity> {
    const createdInstructor = await this.prisma.instructor.create({
      data: {
        userId: instructor.userId,
        isIndependent: instructor.isIndependent,
        name: instructor.name,
        familyName: instructor.familyName,
        gender: instructor.gender,
        phone: instructor.phone,
        stableId: instructor.stableId,
      },
    });
    return InstructorMapper.toDomain(createdInstructor);
  }

  async findByStableId(stableId: string): Promise<InstructorEntity[]> {
    const instructors = await this.prisma.instructor.findMany({
      where: { stableId },
    });
    return instructors.map((instructor) =>
      InstructorMapper.toDomain(instructor),
    );
  }

  async findByUserId(userId: string): Promise<InstructorEntity | null> {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
      include: { stable: true },
    });
    return instructor
      ? InstructorMapper.toDomain({
          ...instructor,
          stable: instructor.stable || undefined,
        })
      : null;
  }

  async findById(id: string): Promise<InstructorEntity | null> {
    const instructor = await this.prisma.instructor.findFirst({
      where: { id },
    });
    return instructor ? InstructorMapper.toDomain(instructor) : null;
  }
}
