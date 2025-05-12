export class FindNotificationsByUserIdQuery {
  constructor(
    public readonly userId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly type: string,
  ) {}
}
