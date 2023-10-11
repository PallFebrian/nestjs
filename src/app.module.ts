import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { BookModule } from './book/book.module';
import { AuthModule } from './app/auth/auth.module';
import { MailModule } from './app/mail/mail.module';
import { KategoriModule } from './app/kategori/kategori.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), BookModule, AuthModule, MailModule, KategoriModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
