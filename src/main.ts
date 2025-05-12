import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { join } from 'path';
import { AppModule } from './presentation/modules/app.module';
import { copyData } from './scripts/copy-data';
import { copyTemplates } from './scripts/copy-email-templates';

async function bootstrap() {
  copyData();
  copyTemplates();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  app.setViewEngine('ejs');
  app.setBaseViewsDir(
    join(__dirname, '..', 'dist/infrastructure/email/templates'),
  );

  app.use(morgan('dev'));
  app.use(compression());
  app.use(helmet());
  app.enableCors({
    origin: [process.env.FRONTEND_URL as string],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // const { doubleCsrfProtection } = doubleCsrf({
  // getSecret: () => process.env.CSRF_SECRET as string,
  // cookieName: 'x-csrf-token',
  // cookieOptions: {
  // httpOnly: true,
  // sameSite: 'strict',
  // secure: process.env.NODE_ENV === 'production',
  // },
  // });
  // app.use(doubleCsrfProtection);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Boilerplate NestJS')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('doc', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then(() => {
    console.log(`Server is running on port ${process.env.PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });
