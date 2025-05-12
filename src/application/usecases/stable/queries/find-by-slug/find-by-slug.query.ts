export class FindBySlugQuery {
  constructor(
    public readonly slug: string,
    public readonly id: string,
  ) {}
}
