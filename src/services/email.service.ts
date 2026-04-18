import nodemailer, { Transporter } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

import { configs } from "../config/configs";
import { emailConstants } from "../constants/email.constants";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { EmailTypeToPayload } from "../types/email-type-to-payload.type";

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      from: "No reply",
      auth: {
        user: configs.SMTP_EMAIL,
        pass: configs.SMTP_PASSWORD,
      },
      connectionTimeout: 10000, // 10 секунд на подключение
      greetingTimeout: 5000, // 5 секунд на приветствие
      socketTimeout: 10000,
      logger: true,
      debug: true,
    });
    const templatesDir = path.resolve(process.cwd(), "src", "templates");
    console.log("Templates path:", templatesDir); // Увидишь в консоли, куд
    const hbsOptions = {
      viewEngine: {
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: path.join(templatesDir, "layouts"),
        partialsDir: path.join(templatesDir, "partials"),
      },
      viewPath: path.join(templatesDir, "views"),
      extName: ".hbs",
    };

    this.transporter.use("compile", hbs(hbsOptions));
  }

  public async sendMail<T extends EmailTypeEnum>(
    type: T,
    to: string,
    context: EmailTypeToPayload[T],
  ): Promise<void> {
    console.log(`Starting to send email to: ${to}...`); // Проверка: доходит ли сюда выполнение
    try {
      const { subject, template } = emailConstants[type];
      const options = {
        from: `MovieDB <${configs.SMTP_EMAIL}>`, // Явно укажите отправителя здесь
        to,
        subject,
        template,
        context,
      };
      await this.transporter.sendMail(options);
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
