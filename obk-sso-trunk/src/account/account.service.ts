import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path as needed
import { Account } from 'generated/prisma';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Account | null> {
    return await this.prisma.account.findUnique({
      where: {
        id,
      },
    });
  }
}
