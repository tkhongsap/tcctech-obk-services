import dotenv from 'dotenv';
import { resolve, join } from 'path';
import { execSync } from 'child_process';
import { name as appName } from '../../package.json';
dotenv.config({ path: '.env.test' });

export default async function globalSetup(): Promise<void> {
  // Setup DB
  const scriptPath = resolve(join(__dirname, '..', '..', 'scripts', `setup-db.sh --name ${appName}_test --port 5433`));
  execSync(scriptPath);
  execSync('yarn db:migrate', { stdio: 'inherit' });
}
