import { Module } from '@nestjs/common';
import { KategoriController } from './kategori.controller';
import { KategoriService } from './kategori.service';
import { Kategori } from './kategori.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [KategoriController],
  providers: [KategoriService],
  imports: [TypeOrmModule.forFeature([Kategori])],
})
export class KategoriModule {}
