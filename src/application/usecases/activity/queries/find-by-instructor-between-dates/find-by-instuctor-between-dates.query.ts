export class FindActivitiesByInstructorIdBetweenDatesQuery {
  constructor(
    public readonly instructorId: string,
    public readonly date: Date,
  ) {}
}
