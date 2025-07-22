import { Controller, Get, Param } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(':id')
  async show(@Param('id') id: string) {
    const account = await this.accountService.findById(id);
    return { data: account };
  }
}
