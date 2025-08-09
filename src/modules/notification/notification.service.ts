import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { UsersService } from '../users/users.service';



@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private userService: UsersService, // Inyectar el UserService

  ) { }

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    // Extraer solo los nombres de los recipients y unirlos con punto y coma
    const recipientNames = createNotificationDto.recipients
      .map(recipient => recipient.name)
      .join(';');

    const notification = this.notificationRepository.create({
      recipients: recipientNames,
      subject: createNotificationDto.subject,
      body: createNotificationDto.body,
      timestamp: new Date(createNotificationDto.timestamp),
      totalRecipients: createNotificationDto.totalRecipients,
      status: createNotificationDto.status ?? true,
      instiution: createNotificationDto.instiution,
      userId: createNotificationDto.userId
    });

    return await this.notificationRepository.save(notification);
  }

  async findAll(institution: number): Promise<Notification[]> {
    const notifications = await this.notificationRepository.find({
      where: { instiution: institution },
      order: { createdAt: 'DESC' }
    });

    // Obtener datos de usuario para cada notificación
    const notificationsWithUser = await Promise.all(
      notifications.map(async (notification) => {
        let user = null;
        if (notification.userId) {
          try {
            user = await this.userService.findOneUser(notification.userId);
          } catch (error) {
            console.error(`Usuario con ID ${notification.userId} no encontrado:`, error);
            user = null;
          }
        }

        return {
          ...notification,
          user: user ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.notificationEmail,
            // Agrega otros campos que necesites del usuario
          } : null
        };
      })
    );
    return notificationsWithUser;
  }


  async findOne(id: number): Promise<any> {
    const notification = await this.notificationRepository.findOne({
      where: { id }
    });

    if (!notification) {
      throw new Error(`Notification with ID ${id} not found`);
    }

    // Obtener datos del usuario si existe userId
    let user = null;
    if (notification.userId) {
      try {
        user = await this.userService.findOneUser(notification.userId);
      } catch (error) {
        console.error(`Usuario con ID ${notification.userId} no encontrado:`, error);
        user = null;
      }
    }

    return {
      ...notification,
      user: user ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        // Agrega otros campos que necesites del usuario
      } : null
    };
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    await this.notificationRepository.update(id, updateNotificationDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.notificationRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Notification with ID ${id} not found`);
    }
  }

  // Método adicional para obtener las notificaciones por estado
  async findByStatus(status: boolean, institution: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { status, instiution: institution },
      order: { createdAt: 'DESC' }
    });
  }
}