import { get, unset } from 'lodash';
import {
  ExternalIdentityRepository,
  IdentityRepository,
  OtpRepository,
  TokenRepository,
  ApiKeyRepository,
} from 'ob-iam/src/repositories';
import { Request } from 'express';
import { account } from 'ob-iam/db/client';
import { comparePassword } from '../../../utils/encrypt';
import { getIdentifier } from '../../../utils/identifier';

const tokenRepository = new TokenRepository();
const identityRepository = new IdentityRepository();
const externalIdentityRepository = new ExternalIdentityRepository();
const apiKeyRepository = new ApiKeyRepository();

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

const apiKeyStrategy: Strategy = async (
  req: Request,
): Promise<account | null> => {
  const apiKeyId: string = '' + get(req, 'headers.x-api-key-id', '');
  const apiKeySecret: string = '' + get(req, 'headers.x-api-key-secret', '');
  const record = await apiKeyRepository.findActive(apiKeyId, apiKeySecret);
  if (record) {
    return record.account;
  }

  return null;
};

const tokenStrategy: Strategy = async (
  req: Request,
): Promise<account | null> => {
  const token: string = '' + get(req, 'headers.x-access-token', '');
  const record = await tokenRepository.findBy({ value: token, active: true });
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

  const otpRepository = new OtpRepository();
  const otp = await otpRepository.findBy({ id, reference });

  if (otp) {
    const where = {
      identifier: getIdentifier(provider, identifier, country_code),
      provider: provider === 'sso' ? 'email' : provider,
      account: { deleted_at: null },
    };
    if (includeDeletedAccount) {
      unset(where, 'account');
    }
    const record = await identityRepository.findBy(where);
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
    const record = await identityRepository.findBy({
      identifier: getIdentifier(provider, identifier, country_code),
      provider,
      account: { password: { not: null } },
    });

    if (record) {
      const account = record.account;
      const dbPassword = account.password;
      if (!dbPassword) {
        return null;
      }
      const compareResult = await comparePassword(password, dbPassword);
      return compareResult ? record.account : null;
    }
  } else if (provider === 'sso') {
    const record = await externalIdentityRepository.find({
      identifier,
      type,
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

export {
  tokenStrategy,
  otpStrategy,
  passwordStrategy,
  compositeStrategy,
  apiKeyStrategy,
};
