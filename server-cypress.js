const fs = require('fs');
const path = require('path');

// Dependabot (and other restricted) runs don't receive ENVIRONMENT_FILE.
// Fall back to the committed template so the build still compiles.
const environment = process.env.ENVIRONMENT_FILE
  ? `${process.env.ENVIRONMENT_FILE}`
  : fs.readFileSync(
      path.join('src/environments', 'environment.template.ts'),
      'utf8'
    );

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
