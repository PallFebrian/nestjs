import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import BaseResponse from 'src/utils/response/base.response';
import { Kategori } from './kategori.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import {
  CreateKategoriDto,
  UpdateKategoriDto,
  findAllKategori,
} from './kategori.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';

@Injectable()
export class KategoriService extends BaseResponse {
  constructor(
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
    @Inject(REQUEST) private req: any, // inject request agar bisa mengakses req.user.id dari  JWT token pada service
  ) {
    super();
  }

  async create(payload: CreateKategoriDto): Promise<ResponseSuccess> {
    try {
      //   await this.kategoriRepository.save({
      //     ...payload,
      //     created_by: {
      //       id: this.req.user.id,
      //     },
      //   });
      await this.kategoriRepository.save(payload); // cukup payload tanpa manipulasi object

      return this._success('OK', this.req.user.user_id);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const detailBook = await this.kategoriRepository.findOne({
      where: {
        id,
      },
    });

    if (detailBook === null) {
      throw new HttpException(
        `Buku dengan id ${id} tidak ditemukan`,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      status: 'Success',
      message: 'Detail Buku ditermukan',
      data: detailBook,
    };
  }

  async updateKategori(
    id: number,
    updateKategoriDto: UpdateKategoriDto,
  ): Promise<ResponseSuccess> {
    const check = await this.kategoriRepository.findOne({
      where: {
        id,
      },
    });

    if (!check) throw new NotFoundException(`id ${id} tidak ditemukan`);

    const update = await this.kategoriRepository.save({
      ...updateKategoriDto,
      id: id,
    });
    return {
      status: `Success `,
      message: 'Buku berhasil di update',
      data: update,
    };
  }

  async deleteKategori(id: number): Promise<ResponseSuccess> {
    const check = await this.kategoriRepository.findOne({
      where: {
        id,
      },
    });

    if (!check) throw new NotFoundException(`id ${id} tidak ditemukan`);
    await this.kategoriRepository.delete(id);
    return {
      status: `Success `,
      message: 'Berhasil menghapus kategori',
    };
  }

  async getAllCategory(query: findAllKategori): Promise<ResponsePagination> {
    const { page, pageSize, limit, nama_kategori } = query;

    // const filterQuery = {};

    const filterQuery: {
      [key: string]: any;
    } = {};

    if (nama_kategori) {
      filterQuery.nama_kategori = Like(`%${nama_kategori}%`);
    }
    const total = await this.kategoriRepository.count({
      where: filterQuery,
    });
    const result = await this.kategoriRepository.find({
      where: filterQuery,
      relations: ['created_by', 'updated_by'], // relasi yang aka ditampilkan saat menampilkan list kategori
      select: {
        // pilih data mana saja yang akan ditampilkan dari tabel kategori
        id: true,
        nama_kategori: true,
        created_by: {
          id: true, // pilih field  yang akan ditampilkan dari tabel user
          nama: true,
        },
        updated_by: {
          id: true, // pilih field yang akan ditampilkan dari tabel user
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });

    return this._pagination('OK', result, total, page, pageSize);
  }

  async createBulk(payload: CreateKategoriDto[]): Promise<ResponseSuccess> {
    console.log(payload);
    try {
      const kategoris = payload.map((kategoriDto) => ({
        ...kategoriDto,
        created_by: { id: this.req.user.id },
      }));

      await this.kategoriRepository.save(kategoris);

      return this._success('Bulk create successful', payload);
    } catch (error) {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
