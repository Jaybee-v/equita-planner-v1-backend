import { Inject, Injectable } from '@nestjs/common';
import { NotificationEntity } from 'src/domain/entities/notifications.entity';
import { StableEntity } from 'src/domain/entities/stable.entity';
import { NotificationSender } from 'src/domain/enums/notification-sender.enum';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';
import { NotificationType } from 'src/domain/enums/notification-type';
import { INotificationRepository } from 'src/domain/interfaces/notification.repository';
import { IGeoCodeService } from 'src/domain/interfaces/services/geo-code.service';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { CreateStableCommand } from './create-stable.command';
@Injectable()
export class CreateStableHandler {
  constructor(
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
    @Inject('IGeoCodeService')
    private readonly geoCodeService: IGeoCodeService,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(command: CreateStableCommand): Promise<StableEntity> {
    const {
      userId,
      name,
      street,
      numStreet,
      zip,
      city,
      country,
      phone,
      website,
    } = command;

    const address = `${numStreet} ${street}, ${city}, ${zip}, ${country}`;

    const geoCode = await this.geoCodeService.geocodeAddress(address);

    const stable = StableEntity.create({
      userId,
      name,
      street: geoCode.street,
      numStreet,
      zip: geoCode.zipcode,
      city: geoCode.city,
      country: geoCode.country,
      region: geoCode.region,
      department: geoCode.department,
      phone,
      website,
      latitude: geoCode.latitude,
      longitude: geoCode.longitude,
      slug: StableEntity.generateSlug(name),
    });

    const notification = NotificationEntity.create({
      userId,
      title: 'Félicitations',
      message: 'Vous venez de créer votre compte club',
      status: NotificationStatus.UNREAD,
      type: NotificationType.SUCCESS,
      sendBy: NotificationSender.SYSTEM,
    });

    await this.notificationRepository.create(notification);

    return this.stableRepository.create(stable);
  }
}
