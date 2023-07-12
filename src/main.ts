import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService); // код из документации
  await prismaService.enableShutdownHooks(app);

  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(4200);
}
bootstrap();
