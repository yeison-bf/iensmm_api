import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware para registrar peticiones entrantes
  app.use((req, res, next) => {
    console.log(`Incoming => ${req.method} ${req.url}`);
    next();
  });

  // CORS general
  app.enableCors({
    origin: true, // Permite cualquier origen (para ambientes de desarrollo o pruebas)
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const port = process.env.PORT || 3000;

  // Filtro de excepciones personalizado (descomentar si está implementado)
  // app.useGlobalFilters(new AllExceptionsFilter());

  // Validaciones globales
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));


  await app.listen(port);
  console.log(`✅ HTTP server running on port: ${port}`);

  // Microservicio TCP (opcional, si estás usando microservicios)
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 8877,
    },
  });

  await microservice.listen();
  console.log(`✅ Microservice TCP running on port: 8877`);
}
bootstrap();
