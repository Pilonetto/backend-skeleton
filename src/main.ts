import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Increase the payload size limit
  app.use(bodyParser.json({ limit: '50mb' })); // Set the limit to 10mb
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    //origin: 'http://localhost:3001'
    origin: true,
  });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('IAG WhatsApp Manager')
    .setDescription('WhatsApp messaging and campaign sending service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.setGlobalPrefix('api');

  app.use((req, res, next) => {
    if (
      req.method === 'GET' &&
      !req.url.startsWith('/api') &&
      !req.url.includes('.')
    ) {
      res.sendFile(join(__dirname, '..', 'public', 'index.html'));
    } else {
      next();
    }
  });

  await app.listen(3008, '0.0.0.0');
}
bootstrap();
