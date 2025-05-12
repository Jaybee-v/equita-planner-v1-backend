export class FindAffiliationByStableIdQuery {
  constructor(
    public readonly stableId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly requestedBy: string,
  ) {}
}
