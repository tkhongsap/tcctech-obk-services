import { get, unset } from 'lodash';
import { Request } from 'express';
import { comparePassword } from '../../../utils/encrypt';
import { getIdentifier } from '../../../utils/identifier';
import TokenRepository from '../../../repositories/token_repository';
import IdentityRepository from '../../../repositories/identity_repository';
import ExternalIdentityRepository from '../../../repositories/external_identity_repository';
import ApiKeyRepository from '../../../repositories/api_key_repository';
import { account } from '../../../../db/client';
import OtpRepository from '../../../repositories/otp_repository';
import AccountRepository from '../../../repositories/account_repository';

interface Strategy {
  (req: Request): Promise<account | null>;
}

type CompositeStrategyResult = {
  account: account | null;
  strategy: string;
  result: boolean;
};

interface CompositeStrategy {
  (req: Request, strategies: Strategy[]): Promise<CompositeStrategyResult>;
}

const apiKeyStrategy: Strategy = async (req: Request): Promise<account | null> => {
  const apiKeyId: string = '' + get(req, 'headers.x-api-key-id', '');
  const apiKeySecret: string = '' + get(req, 'headers.x-api-key-secret', '');
  if (apiKeyId && apiKeySecret) {
    const record = await ApiKeyRepository.findFirst({
      where: {
        id: apiKeyId,
        secret: apiKeySecret,
        OR: [{ expired_at: null }, { expired_at: { gt: new Date() } }],
      },
      include: { account: true },
    });
    if (record) {
      return record.account;
    }
  }

  return null;
};

const tokenStrategy: Strategy = async (req: Request): Promise<account | null> => {
  const token: string = '' + get(req, 'headers.x-access-token', '');
  // split token incase of Bearer token (Bearer <token>)
  const splitedToken = token.split(' ');
  if (splitedToken[splitedToken.length - 1]) {
    const record = await TokenRepository.findFirst({
      where: { value: splitedToken[splitedToken.length - 1], active: true },
      include: { account: true },
    });
    if (record) {
      return record.account;
    }
  }
  return null;
};

const refreshTokenStrategy: Strategy = async (req: Request): Promise<account | null> => {
  const token: string = '' + get(req, 'headers.X-Refresh-Token', '');
  // split token incase of Bearer token (Bearer <token>)
  const splitedToken = token.split(' ');
  const record = await TokenRepository.findFirst({
    where: { value: splitedToken[splitedToken.length - 1], active: true },
    include: { account: true },
  });
  if (record) {
    return record.account;
  }

  return null;
};

const otpStrategy = async (
  req: Request,
  id: string,
  reference: string,
  includeDeletedAccount?: boolean,
): Promise<account | null> => {
  const {
    identity: { identifier, provider, country_code },
  } = req.body;

  if (!id) return null;

  const otp = await OtpRepository.findFirst({ where: { id, reference } });

  if (otp) {
    const where = {
      identifier: getIdentifier(provider, identifier, country_code),
      provider: provider === 'sso' ? 'email' : provider,
      account: { deleted_at: null },
    };
    if (includeDeletedAccount) {
      unset(where, 'account');
    }
    const record = await IdentityRepository.findFirst({ where: where, include: { account: true } });
    if (record) {
      return record.account;
    }
  }

  return null;
};

const passwordStrategy = async (req: Request): Promise<account | null> => {
  const {
    identity: { identifier, provider, type, country_code },
    password,
  } = req.body;

  if (password) {
    const record = await IdentityRepository.findFirst({
      where: {
        identifier: getIdentifier(provider, identifier, country_code),
        provider,
      },
    });

    const account = await AccountRepository.findFirst({
      where: {
        id: record?.account_id,
      },
    });

    if (record && account) {
      const dbPassword = account.password;
      if (!dbPassword) {
        return null;
      }
      const compareResult = await comparePassword(password, dbPassword);
      return compareResult ? account : null;
    }
  } else if (provider === 'sso') {
    const record = await ExternalIdentityRepository.findFirst({
      where: {
        identifier,
        type,
      },
      include: { account: true },
    });
    if (record) {
      return record.account;
    }
  }
  return null;
};

const compositeStrategy: CompositeStrategy = async (
  req: Request,
  strategies: Strategy[],
): Promise<CompositeStrategyResult> => {
  for (const strategy of strategies) {
    const result = await strategy(req);
    if (result) {
      return {
        account: result,
        strategy: strategy.name,
        result: true,
      };
    }
  }

  return {
    account: null,
    strategy: '',
    result: false,
  };
};

export { tokenStrategy, otpStrategy, passwordStrategy, compositeStrategy, apiKeyStrategy, refreshTokenStrategy };
