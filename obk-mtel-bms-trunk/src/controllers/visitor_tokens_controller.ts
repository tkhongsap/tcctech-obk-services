import { Controller, Get, OperationId, Queries, Route } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import { Prisma, VisitorToken } from '../../db/client/';
import { VisitorTokenRepository } from '../repositories';
import { get, map } from 'lodash';

interface VisitorTokenData extends Omit<VisitorToken, 'created_at' | 'updated_at'> {
  uid: string;
  created_at: string;
  updated_at: string;
}

interface VisitorTokensIndexQuery {
  token_id?: string;
}

type VisitorTokensIndexResponseData = VisitorTokenData[];

type VisitorTokenSerializerInput =
  | VisitorToken
  | Prisma.VisitorTokenGetPayload<{ include: { visitor_schedule: true } }>
  | Prisma.VisitorTokenGetPayload<{ include: { visitor_schedule: { include: { passes: true } } } }>;

function visitorTokenSerializer(visitorToken: VisitorTokenSerializerInput): VisitorTokenData {
  return {
    ...visitorToken,
    uid: get(visitorToken, 'visitor_schedule.passes[0].uid')!,
    created_at: visitorToken.created_at.toDateString(),
    updated_at: visitorToken.updated_at.toDateString(),
  };
}

@Route('visitor_tokens')
export class VisitorTokensController extends Controller {
  @Get()
  @OperationId('visitor_tokens.index')
  public async index(
    @Queries() query: VisitorTokensIndexQuery,
  ): Promise<WrappedResponse<VisitorTokensIndexResponseData>> {
    let whereQuery = {};

    if (query.token_id) {
      whereQuery = { token_id: query.token_id };
    }
    const visitorTokens = await VisitorTokenRepository.findMany({
      where: whereQuery,
      include: {
        visitor_schedule: {
          include: {
            passes: true,
          },
        },
      },
    });

    return { data: map(visitorTokens, (visitorToken) => visitorTokenSerializer(visitorToken)) };
  }
}
