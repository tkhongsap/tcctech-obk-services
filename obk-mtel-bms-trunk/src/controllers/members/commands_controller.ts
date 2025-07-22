import { Body, Get, OperationId, Path, Post, Route, Queries } from 'tsoa';
import { WrappedResponse } from '../base_controller.interfaces';
import { CommandRepository, MemberRepository } from '../../repositories';
import {
  CommandsCreateBody,
  CommandsCreateResponse,
  CommandsIndexResponse,
  CommandsIndexQuery,
} from './commands_controller.interface';
import { BaseController } from '../base_controller';
import { CommandService } from '../../services';
import ActivityLog from '../../utils/activity_log';

@Route('members/:member_id/commands')
export class CommandsController extends BaseController {
  @Get('')
  @OperationId('members.commands.index')
  public async index(
    @Path() member_id: string,
    @Queries() query: CommandsIndexQuery,
  ): Promise<WrappedResponse<CommandsIndexResponse>> {
    const commands = await CommandRepository.findMany(this.buildQuery({ ...query, member_id }));

    this.setStatus(200);
    return {
      data: commands,
    };
  }

  @Post('')
  @OperationId('members.commands.create')
  @ActivityLog('members.commands.create')
  public async create(
    @Path() member_id: string,
    @Body() body: CommandsCreateBody,
  ): Promise<WrappedResponse<CommandsCreateResponse>> {
    const member = await MemberRepository.findFirst({ where: { id: member_id } });

    const commandService = new CommandService(member!);
    const command = await commandService.execute(body.name, body.data);

    this.setStatus(200);

    return {
      data: command!,
    };
  }
}
