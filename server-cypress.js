const fs = require('fs');
const path = require('path');

// Restricted runs (e.g. Dependabot) don't receive ENVIRONMENT_FILE. Those
// jobs opt into the placeholder template via ALLOW_ENV_TEMPLATE_FALLBACK so
// they still compile. Deploy jobs must NOT set it: a missing secret then
// fails the build loudly instead of silently shipping a blank config.
let environment;
if (process.env.ENVIRONMENT_FILE) {
  environment = `${process.env.ENVIRONMENT_FILE}`;
} else if (process.env.ALLOW_ENV_TEMPLATE_FALLBACK === 'true') {
  environment = fs.readFileSync(
    path.join('src/environments', 'environment.template.ts'),
    'utf8'
  );
} else {
  console.error(
    'ENVIRONMENT_FILE is not set and ALLOW_ENV_TEMPLATE_FALLBACK is not enabled'
  );
  process.exit(1);
}

const filesList = [
  {
    dir: 'src/environments',
    name: 'environment.development.ts',
    content: environment
  },
  {
    dir: 'cypress/fixtures',
    name: 'accounts.json',
    content: `${process.env.ACCOUNTS_FILE}`
  }
];

filesList.forEach((file) => {
  const dir = file.dir;
  const fileName = file.name;
  const content = file.content;
  fs.access(dir, fs.constants.F_OK, (err) => {
    if (err) {
      // Directory doesn't exist
      console.log("src doesn't exist, creating now", process.cwd());
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
    // Now write to file
    try {
      fs.writeFileSync(dir + '/' + fileName, content);
      console.log('Created successfully in', process.cwd());
      if (fs.existsSync(dir + '/' + fileName)) {
        console.log('File is created', path.resolve(dir + '/' + fileName));
        const str = fs.readFileSync(dir + '/' + fileName).toString();
        console.log(str);
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
});
