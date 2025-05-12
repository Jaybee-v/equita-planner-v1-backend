import { InstructorEntity } from '../entities/instructor.entity';

export interface IInstructorRepository {
  create(instructor: InstructorEntity): Promise<InstructorEntity>;
  findByStableId(stableId: string): Promise<InstructorEntity[]>;
  findByUserId(userId: string): Promise<InstructorEntity | null>;
  findById(id: string): Promise<InstructorEntity | null>;
}
