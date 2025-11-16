// scripts/run-acceptance.ts

import { spawnSync } from 'child_process';
import path from 'path';
import {
  ACCEPTANCE_SUITES,
  type AcceptanceSuiteId
} from '../src/lib/dadmin/tests/acceptance-suites';

function resolveSuite(): string | null {
  const suiteId = process.argv[2] as AcceptanceSuiteId | undefined;
  if (!suiteId) return null;

  const suite = ACCEPTANCE_SUITES.find(s => s.id === suiteId);
  if (!suite) {
    console.error('Unknown acceptance suite:', suiteId);
    process.exit(1);
  }

  return suite.tag;
}

function run() {
  const tag = resolveSuite();
  const args = ['playwright', 'test', 'tests/acceptance'];

  if (tag) {
    args.push('--grep', tag);
    console.log('Running suite with tag:', tag);
  } else {
    console.log('Running ALL acceptance tests…');
  }

  const result = spawnSync('npx', args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      PLAYWRIGHT_JSON_OUTPUT: path.join(
        process.cwd(),
        'qa',
        'artifacts',
        'last-run.json'
      )
    }
  });

  process.exit(result.status ?? 1);
}

run();
