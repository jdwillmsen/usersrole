const fs = require('fs');
const path = require('path');

const dir = 'src/environments';
const file = 'environment.ts';

// Restricted runs (e.g. Dependabot) don't receive ENVIRONMENT_FILE. Those
// jobs opt into the placeholder template via ALLOW_ENV_TEMPLATE_FALLBACK so
// they still compile. Deploy jobs must NOT set it: a missing secret then
// fails the build loudly instead of silently shipping a blank config.
let content;
if (process.env.ENVIRONMENT_FILE) {
  content = `${process.env.ENVIRONMENT_FILE}`;
} else if (process.env.ALLOW_ENV_TEMPLATE_FALLBACK === 'true') {
  content = fs.readFileSync(path.join(dir, 'environment.template.ts'), 'utf8');
} else {
  console.error(
    'ENVIRONMENT_FILE is not set and ALLOW_ENV_TEMPLATE_FALLBACK is not enabled'
  );
  process.exit(1);
}

fs.access(dir, fs.constants.F_OK, (err) => {
  if (err) {
    // Directory doesn't exist
    console.log("src doesn't exist, creating now", process.cwd());
    // Create /src
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }
  // Now write to file
  try {
    fs.writeFileSync(dir + '/' + file, content);
    console.log('Created successfully in', process.cwd());
    if (fs.existsSync(dir + '/' + file)) {
      console.log('File is created', path.resolve(dir + '/' + file));
      const str = fs.readFileSync(dir + '/' + file).toString();
      console.log(str);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
