import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, FindBookDto, UpdateBookDto } from './book.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('list')
  getAllBook(@Pagination() query: FindBookDto) {
    console.log('query', query);
    return this.bookService.getAllBoook(query);
  }

  @Get('detail/:id')
  getDetailBook(@Param('id') id: string) {
    return this.bookService.getDetail(Number(id));
  }

  @Post('create')
  createBook(@Body() payload: CreateBookDto) {
    return payload;
  }
  @Put('update/:id')
  updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(Number(id), updateBookDto);
  }
  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(+id);
  }
}
