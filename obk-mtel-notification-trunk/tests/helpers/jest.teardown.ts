import { resolve, join } from 'path';
import { execSync } from 'child_process';
import { name as appName } from '../../package.json';

export default async function globalTeardown(): Promise<void> {
  // Teardown DB
  const scriptPath = resolve(join(__dirname, '..', '..', 'scripts', `teardown-db.sh --name ${appName}_test --destroy`));
  execSync(scriptPath);
}
