import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Configuration } from './common/config'
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import {json} from "express";
import * as cors from 'cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('v1');
  const port = configService.get<Configuration['port']>('port');
  const config = new DocumentBuilder()
      .setTitle('NEST JWT')
      .setDescription('The NEST JWT description')
      .addBearerAuth()
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(json({ limit: '50mb' }));

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Allow your Next.js app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent
  });

  await app.listen(port);
  console.debug(`Application listen on ${await app.getUrl()}`)
}
bootstrap();
