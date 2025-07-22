import dotenv from 'dotenv';
import { resolve, join } from 'path';
import { execSync } from 'child_process';

dotenv.config({ path: '.env.test' });

export default async function globalSetup(): Promise<void> {
  // Setup DB
  const scriptPath = resolve(join(__dirname, '..', '..', 'scripts', 'setup-db.sh --name ob_bms_test --port 5435'));
  execSync(scriptPath);
  execSync('yarn db:migrate', { stdio: 'inherit' });
}
