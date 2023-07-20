import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetAllProductDto } from './dto/get-all.product.dto';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() queryDto: GetAllProductDto) {
    return this.productService.getAll(queryDto);
  }

  @Get('similar/:id')
  async getSimilar(@Param('id') id: string) {
    return this.productService.bySimilar(+id);
  }

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.productService.bySlug(slug);
  }

  @Get('by-category/:categorySlug')
  async getProductByCategory(@Param('categorySlug') categorySlug: string) {
    return this.productService.byCategory(categorySlug);
  }

  @Get(':id')
  @Auth()
  async getProduct(@Param('id') id: string) {
    return this.productService.byId(+id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async create() {
    return this.productService.create();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.update(+id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.productService.delete(+id);
  }
}
