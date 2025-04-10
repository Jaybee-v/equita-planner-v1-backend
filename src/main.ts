import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppModule } from './presentation/modules/app.module';
import { copyData } from './scripts/copy-data';

async function bootstrap() {
  copyData();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.use(morgan('dev'));
  app.use(compression());
  app.use(helmet());
  app.enableCors();

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
