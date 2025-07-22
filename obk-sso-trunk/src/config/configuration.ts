import * as z from 'zod/v4';
import { Logger } from '@nestjs/common';

export const configSchema = z.object({
  PORT: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
});

export type ConfigType = z.infer<typeof configSchema>;

export function validate(config: Record<string, unknown>) {
  const parsed = configSchema.safeParse(config);

  if (!parsed.success) {
    const logger = new Logger('ConfigValidation');
    const flattened = z.flattenError(parsed.error);

    logger.error(
      'Environment validation failed with the following errors:',
      flattened,
    );
    throw new Error('Environment validation failed');
  }

  return parsed.data; // fully typed and parsed
}

export default () => ({
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
});
