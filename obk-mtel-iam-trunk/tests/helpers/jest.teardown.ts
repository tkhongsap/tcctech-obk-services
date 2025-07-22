import { resolve, join } from 'path';
import { execSync } from 'child_process';

export default async function globalTeardown(): Promise<void> {
  // Teardown DB
  const scriptPath = resolve(join(__dirname, '..', '..', 'scripts', 'teardown-db.sh --name ob-iam_test --destroy'));
  execSync(scriptPath);

  const scriptPathRo = resolve(
    join(__dirname, '..', '..', 'scripts', 'teardown-db.sh --name ob-iam_test-ro --destroy'),
  );
  execSync(scriptPathRo);
}
