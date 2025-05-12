import { SelectRiderLevelRequestForNotification } from 'src/domain/enums/select-rider-level-request-for-notification';

export class SendActivityNotificationCommand {
  constructor(
    public readonly stableId: string,
    public readonly activityId: string,
    public readonly message: string,
    public readonly type: string,
    public readonly requestedBy: string,
    public readonly riderLevel: SelectRiderLevelRequestForNotification,
  ) {}
}
