export class UpdateImagesQuery {
  constructor(
    public readonly stableId: string,
    public readonly logoUrl: string | null,
    public readonly picture1: string | null,
    public readonly picture2: string | null,
    public readonly picture3: string | null,
    public readonly userId: string,
  ) {}
}
