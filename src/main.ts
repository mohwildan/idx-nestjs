import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ValidationFilter } from './common/validation/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const config = new DocumentBuilder()
    .setTitle('App example')
    .setDescription('The app API description')
    .addTag('app')
    .addSecurity('JWT', { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ValidationFilter());
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);

  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
