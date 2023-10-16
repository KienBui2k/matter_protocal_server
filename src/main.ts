import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors: true});
  // Setup Api
  app.setGlobalPrefix('api');
  app.enableVersioning({
        type: VersioningType.URI,
    defaultVersion: ['1'],
  })
  app.enableCors()
  // Setup Swagger
      const config = new DocumentBuilder()
    .setTitle('Cart example')
    .setDescription('The cart API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  /* Setup Validate 
    Xóa bỏ những thành phần không có trong quy định của data đầu vào
  */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT);
  console.log(`app listen http://localhost:${process.env.PORT}`);
}

bootstrap();
