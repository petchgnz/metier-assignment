import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Blog Management System API')
      .setDescription('REST API documentation for Metier Assignment')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'access-token',
      )
      .addTag('Auth')
      .addTag('Blogs (Public)')
      .addTag('Blogs (Admin)')
      .addTag('Comments (Public)')
      .addTag('Comments (Admin)')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    console.log('Swagger docs available at /api/docs');
  }

  const PORT = process.env.PORT ?? 3001;
  await app.listen(PORT, () =>
    console.log(`server is running on port ${PORT}`),
  );
}
bootstrap();
