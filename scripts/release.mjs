// Runs semantic-release through its API rather than its CLI so the deploy job
// is told what was actually published. The CLI only reports through its exit
// code, which is 0 both when it tags a release and when there is nothing to
// release, and inferring the difference from tags is fragile.
import { appendFileSync } from 'node:fs';
import semanticRelease from 'semantic-release';

const result = await semanticRelease();

// A result without nextRelease still happens: semantic-release can return the
// releases it merged onto another channel without cutting a new version.
const version = result && result.nextRelease ? result.nextRelease.version : '';

const outputs = [
  `new-release-published=${version !== ''}`,
  `new-release-version=${version}`
].join('\n');

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `${outputs}\n`);
} else {
  console.log(outputs);
}
