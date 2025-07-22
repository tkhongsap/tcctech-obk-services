import dotenv from 'dotenv';
import { resolve, join } from 'path';
import { execSync } from 'child_process';

dotenv.config({ path: '.env.test' });

export default async function globalSetup(): Promise<void> {
  // Setup DB
  const scriptPath = resolve(join(__dirname, '..', '..', 'scripts', 'setup-db.sh --name ob-iam_test --port 5433'));
  execSync(scriptPath);
  execSync('yarn db:migrate', { stdio: 'inherit' });

  const scriptPathRo = resolve(join(__dirname, '..', '..', 'scripts', 'setup-db.sh --name ob-iam_test-ro --port 5434'));
  execSync(scriptPathRo);
  execSync('yarn db:migrate', { stdio: 'inherit' });
}
