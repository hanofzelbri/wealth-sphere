import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { ExceptionFilter } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { ZodError } from 'zod';
import { Catch } from '@nestjs/common';

@Catch(ZodError)
export class ZodFilter<T extends ZodError> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 400;
    response.status(status).json({
      errors: exception.errors,
      message: exception.message,
      statusCode: status,
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Wealth Sphere API Documentation')
    .setDescription(
      'Welcome to the Wealth Sphere API documentation. This API provides a comprehensive set of endpoints for managing and tracking investments, transactions, and market data. Explore the various resources and operations available to integrate with your application and unlock the full potential of your wealth management capabilities.',
    )
    .setVersion('1.0')
    .build();
  patchNestjsSwagger();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  app.useGlobalFilters(new ZodFilter());

  await app.listen(3001);
}
bootstrap();
