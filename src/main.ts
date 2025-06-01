import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import bodyParser, { json, urlencoded } from 'body-parser';

// CRÍTICO: Fix para crypto antes que cualquier otra cosa
const nodeCrypto = require('crypto');
if (!globalThis.crypto) {
  globalThis.crypto = {
    randomUUID: nodeCrypto.randomUUID,
    getRandomValues: (arr: any) => {
      const bytes = nodeCrypto.randomBytes(arr.length);
      arr.set(bytes);
      return arr;
    },
    subtle: nodeCrypto.webcrypto?.subtle,
  };
}

// También definir en global namespace para compatibilidad
if (!global.crypto) {
  global.crypto = globalThis.crypto;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware para registrar peticiones entrantes
  app.use((req, res, next) => {
    console.log(`Incoming => ${req.method} ${req.url}`);
    next();
  });

  // CORS general
  app.enableCors({
    origin: true, 
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const port = process.env.PORT || 3000;
  // CONFIGURAR LÍMITES DE PAYLOAD USANDO EXPRESS DIRECTAMENTE
  // Aumentar límites para peticiones grandes (bulk uploads)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));



  // Validaciones globales
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen(port);
  console.log(`✅ HTTP server running on port: ${port}`);

  // Solo microservicio en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    try {
      const microservice = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8877,
        },
      });

      await microservice.listen();
      console.log(`✅ Microservice TCP running on port: localhost:8877`);
    } catch (error) {
      console.log('⚠️ Microservice TCP not available in this environment');
    }
  }
}

bootstrap().catch(error => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});