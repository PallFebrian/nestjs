import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book } from './book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { CreateBookDto, FindBookDto, UpdateBookDto } from './book.dto';
import {
  ResponsePagination,
  ResponseSuccess,
} from 'src/interface/response.interface';
import BaseResponse from 'src/utils/response/base.response';

@Injectable()
export class BookService extends BaseResponse {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {
    super();
  }

  async getAllBoook(query: FindBookDto): Promise<ResponsePagination> {
    const { page, pageSize, limit, title, author, to_year, from_year } = query;

    const filter: {
      [key: string]: any;
    } = {};

    if (title) {
      filter.title = Like('%${title}%');
    }
    if (author) {
      filter.author = Like('%${author}%');
    }

    if (from_year && to_year) {
      filter.year = Between(from_year, to_year);
    }

    if (from_year && !!to_year === false) {
      filter.year = Between(from_year, from_year);
    }

    console.log('filter', filter);

    const total = await this.bookRepository.count();

    const books = await this.bookRepository.find({
      where: filter,
      skip: limit,
      take: pageSize,
    });

    return this._pagination('Success', books, total, page, pageSize);

    // return {
    //   status: 'Success',
    //   message: 'List Buku ditermukan',
    //   pagination: {
    //     total: total,
    //     page: Number(page),
    //     pageSize: Number(pageSize),
    //   },
    //   data: books,
    // };
  }

  async create(payload: CreateBookDto): Promise<ResponseSuccess> {
    try {
      await this.bookRepository.save(payload);

      return {
        status: 'ok',
        message: 'create berhasil',
      };
    } catch (error) {
      throw new HttpException('ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const detailBook = await this.bookRepository.findOne({
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

  async updateBook(
    id: number,
    updateBookDto: UpdateBookDto,
  ): Promise<ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);

    const update = await this.bookRepository.save({ ...updateBookDto, id: id });
    return {
      status: `Success `,
      message: 'Buku berhasil di update',
      data: update,
    };
  }

  async deleteBook(id: number): Promise<ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    await this.bookRepository.delete(id);
    return {
      status: `Success `,
      message: 'Berhasil menghapus buku',
    };
  }
}
