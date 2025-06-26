import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, htmlContent: string) {
    const html = `
      <div style="max-width:100%;margin:0 auto;font-family:Arial,sans-serif;border:1px solid #e0e0e0;border-radius:4px;overflow:hidden">
        <div style="background:rgb(239, 237, 237);padding:20px;text-align:center">
          <img src="https://edunormas-sys.web.app/assets/logo_green-B_JBPQ6v.png" alt="Edunormas" style="max-height:70%;margin-bottom:10px;" />
        </div>
  
        <div style="padding:20px;font-size:15px;line-height:1.6;color:#333">
          ${htmlContent}
        </div>
  
        <div style="background:#f9f9f9;padding:15px;text-align:center;font-size:12px;color:#999">
          Este mensaje fue generado automáticamente por el sistema Edunormas.<br/>
          Si no esperabas este correo, puedes ignorarlo.
        </div>
      </div>
    `;

    return await this.transporter.sendMail({
      from: `"Notificaciones Edunormas" <${this.configService.get('MAIL_USER')}>`,
      to,
      subject,
      html,
    });
  }

}
