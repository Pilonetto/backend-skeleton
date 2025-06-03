import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './core/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    // TypeOrmModule vai entrar depois com a flag do SQLite
    // UsersModule vai entrar depois como feature
  ],
})
export class AppModule {}
