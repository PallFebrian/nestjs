import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { KategoriService } from './kategori.service';
import {
  CreateKategoriDto,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  UpdateKategoriDto,
  findAllKategori,
} from './kategori.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-updated_by.decorator';

@UseGuards(JwtGuard) //  implementasikan global guard pada semua endpont kategori memerlukan authentikasi saat request
@Controller('kategori')
export class KategoriController {
  constructor(private kategoriService: KategoriService) {}

  @Post('create')
  async create(@InjectCreatedBy() payload: CreateKategoriDto) {
    //ganti @Body() dengan @InjectCreatedBy()
    return this.kategoriService.create(payload);
  }

  @Get('list')
  async getAllCategory(@Pagination() query: findAllKategori) {
    //gunakan custom decorator yang pernah kita buat
    return this.kategoriService.getAllCategory(query);
  }
  @Get('detail/:id')
  getDetailKategori(@Param('id') id: string) {
    return this.kategoriService.getDetail(Number(id));
  }
  @Put('update/:id')
  updateKategori(
    @Param('id') id: string,
    @InjectUpdatedBy() UpdateKategoriDto: UpdateKategoriDto,
  ) {
    return this.kategoriService.updateKategori(Number(id), UpdateKategoriDto);
  }
  @Delete('delete/:id')
  deleteKategori(@Param('id') id: string) {
    return this.kategoriService.deleteKategori(+id);
  }
  @Post('createBulk')
  async createBull(@Body() payload: CreateKategoriDto[]) {
    return this.kategoriService.createBulk(payload);
  }
}
