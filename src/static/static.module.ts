import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(path.dirname(process.execPath), 'dist'),
      serveRoot: '/',
    }),
  ],
})
export class StaticModule {}
