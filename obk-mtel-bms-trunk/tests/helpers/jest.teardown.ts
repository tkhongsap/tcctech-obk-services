import { resolve, join } from 'path';
import { execSync } from 'child_process';

export default async function globalTeardown(): Promise<void> {
  // Teardown DB
  const scriptPath = resolve(join(__dirname, '..', '..', 'scripts', 'teardown-db.sh --name ob_bms_test --destroy'));
  execSync(scriptPath);
}
