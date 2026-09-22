// Renders release notes with the real .releaserc.json config and a sample
// commit, so a changelog preset that the notes generator can no longer render
// fails CI on the pull request that bumps it. Otherwise the break only shows
// up on main, when the next release crashes after the merge.
import { readFileSync } from 'node:fs';
import { generateNotes } from '@semantic-release/release-notes-generator';

const config = JSON.parse(readFileSync('.releaserc.json', 'utf8'));
const entry = config.plugins.find(
  (p) =>
    (Array.isArray(p) ? p[0] : p) ===
    '@semantic-release/release-notes-generator'
);
const pluginConfig = Array.isArray(entry) ? entry[1] : {};

const silent = { log() {}, error() {}, warn() {}, success() {} };
const notes = await generateNotes(pluginConfig, {
  cwd: process.cwd(),
  env: process.env,
  logger: silent,
  options: { repositoryUrl: 'https://github.com/example/example' },
  lastRelease: { gitTag: 'v1.0.0', version: '1.0.0' },
  nextRelease: { gitTag: 'v1.1.0', version: '1.1.0' },
  commits: [
    {
      hash: '0000000000000000000000000000000000000000',
      message: 'feat: sample'
    },
    {
      hash: '1111111111111111111111111111111111111111',
      message: 'chore(deps): bump sample'
    }
  ]
});

if (!notes.includes('sample')) {
  console.error(`Release notes rendered without the sample commits:\n${notes}`);
  process.exit(1);
}
console.log('Release notes render.');
