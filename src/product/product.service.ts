import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductDto } from 'src/product/dto/product.dto';
import {
  productReturnObject,
  productReturnObjectFullest,
} from 'src/product/return-product.object';
import { PrismaService } from 'src/prisma.service';
import { faker } from '@faker-js/faker';
import { EnumProductSort, GetAllProductDto } from './dto/get-all.product.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async getAll(dto: GetAllProductDto = {}) {
    const { sort, searchTerm } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    if (sort === EnumProductSort.LOW_PRICE) {
      prismaSort.push({ price: 'asc' });
    } else if (sort === EnumProductSort.HIGH_PRICE) {
      prismaSort.push({ price: 'desc' });
    } else if (sort === EnumProductSort.OLDEST) {
      prismaSort.push({ createdAt: 'asc' });
    } else if (sort === EnumProductSort.NEWEST) {
      prismaSort.push({ createdAt: 'desc' });
    } else {
      prismaSort.push({ createdAt: 'desc' });
    }

    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive', // неважен регистр слова
                },
              },
            },
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    const { perPage, skip } = this.paginationService.getPagination(dto);

    const products = await this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: perPage,
    });

    return {
      products,
      length: await this.prisma.product.count({
        where: prismaSearchTermFilter,
      }),
    };
  }

  async byId(id: number) {
    const product = this.prisma.product.findUnique({
      where: {
        id,
      },
      select: productReturnObjectFullest,
    });

    if (!product) throw new Error('Product not found');

    return product;
  }

  async bySlug(slug: string) {
    const product = this.prisma.product.findUnique({
      where: {
        slug,
      },
      select: productReturnObjectFullest,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async byCategory(categorySlug: string) {
    const product = this.prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      select: productReturnObjectFullest,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  // похожие товары
  async bySimilar(id: number) {
    const currentProduct = await this.byId(id);

    if (!currentProduct)
      throw new NotFoundException('Current product not found');

    const product = this.prisma.product.findMany({
      where: {
        category: {
          name: currentProduct.category.name,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: productReturnObject,
    });

    return product;
  }

  async create() {
    const product = await this.prisma.product.create({
      data: {
        description: '',
        name: '',
        price: 0,
        slug: '',
      },
    });

    return product.id;
  }

  async update(id: number, dto: ProductDto) {
    const { description, images, price, name, categoryId } = dto;

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        description,
        images,
        price,
        name,
        slug: faker.helpers.slugify(name).toLowerCase(),
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
