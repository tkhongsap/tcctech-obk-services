import { Command, Member } from '../../db/client/';
import FSClient from '../libs/fs_client';
import { CommandRepository, FloorRepository, LocationRepository } from '../repositories';
import logging from '../utils/logging';
import WebhookService from './webhook_service';

export type CommandLiftCallData = {
  location_id: string;
  destination_floor_id: string;
};

export type Lift = {
  name: string;
};

export type LiftCallOutputData = {
  lift: Lift;
};

export type LiftCallOutput = {
  status: 'successful' | 'failed';
  data: LiftCallOutputData;
};

export default class CommandService {
  private member: Member;
  private commands: Record<string, any>;

  constructor(member: Member) {
    this.member = member;
    this.commands = {
      'lift.call': this.liftCall.bind(this),
    };
  }

  public async execute<T>(name: string, data: T): Promise<Command> {
    const command = this.commands[name];
    if (command) {
      const execRes = await command(data);
      const _command = await CommandRepository.create({
        data: {
          name,
          data: data as object,
          status: execRes.status,
          result: execRes.data,
          member: {
            connect: {
              id: this.member.id,
            },
          },
        },
      });

      return _command;
    } else {
      throw new Error(`Command '${name}' not found.`);
    }
  }

  private async liftCall(data: CommandLiftCallData): Promise<LiftCallOutput> {
    const location = await LocationRepository.findFirst({ where: { id: data.location_id } });
    const floor = await FloorRepository.findFirst({ where: { id: data.destination_floor_id } });

    const body = {
      personID: this.member.uid,
      locationID: location!.uid,
      destinationFloorID: floor!.uid,
    };

    logging.info(body);

    const res = await FSClient.liftCall(body);

    const payload = res.data.data;

    logging.info(payload);

    const webhookService = new WebhookService();
    webhookService.handle({
      action: 'lift.called',
      payload: {
        ...payload,
        towerName: '',
      },
    });

    return {
      status: res.data.status === 0 ? 'successful' : 'failed',
      data: {
        lift: {
          name: res.data.data.liftName,
        },
      },
    };
  }
}
