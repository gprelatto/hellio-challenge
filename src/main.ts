import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from 'config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './api/error-handler/global-exception.filter';
import { HttpExceptionFilter } from './api/error-handler/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const port: number = PORT;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Helio Challenge')
    .setDescription(
      '[Gonzalo Prelatto] - NodeJS Task for handling projects with auth',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Insert JWT Token here:`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port, () => {
    console.log('[WEB]', `http://localhost:${PORT}`);
  });
}
bootstrap();
