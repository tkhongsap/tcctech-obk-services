import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { PrismaModule } from '../prisma/prisma.module'; // Adjust path as needed

@Module({
  imports: [PrismaModule],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
