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

  // Configurar microservicio solo si está habilitado
  const enableMicroservice = process.env.ENABLE_MICROSERVICE === 'true';
  
  if (enableMicroservice) {
    try {
      const microservicePort = process.env.MICROSERVICE_PORT || 8877;
      const microserviceHost = process.env.MICROSERVICE_HOST || '0.0.0.0';
      
      const microservice = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
          host: microserviceHost,
          port: parseInt(microservicePort.toString()),
        },
      });

      await microservice.listen();
      console.log(`✅ Microservice TCP running on ${microserviceHost}:${microservicePort}`);
    } catch (error) {
      console.error('❌ Failed to start microservice:', error.message);
      // No fallar toda la aplicación si el microservicio no puede iniciarse
    }
  } else {
    console.log('🔧 Microservice disabled by configuration');
  }
}

bootstrap().catch(error => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});