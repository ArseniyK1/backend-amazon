import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticsService {
  constructor(
    private prisma: PrismaService,
    private user: UserService,
  ) {}

  async getMain(userId: number) {
    const user = await this.user.byId(userId, {
      orders: {
        select: {
          items: true,
        },
      },
      reviews: true,
    });

    // for (let order of user.orders) {
    //   let total = 0
    //   for (let vote of order.votes) {
    //     vote_sum += vote.value
    //   }
    //   ;(question as any).vote_sum = vote_sum
    // }

    return [
      {
        name: 'Orders',
        value: user.orders.length,
      },
      {
        name: 'Reviews',
        value: user.reviews.length,
      },
      {
        name: 'Favorites',
        value: user.favorites.length,
      },
      {
        name: 'Total amount',
        value: 1000,
      },
    ];
  }
}
