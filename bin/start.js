#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const {exec} = require('child_process');

const packageJson = require('../package.json');

const rawScripts = `${JSON.stringify(packageJson.scripts)}`;
const scripts = rawScripts.slice(1, rawScripts.length - 1);
const lintStaged = `"lint-staged": ${JSON.stringify(packageJson['lint-staged'])}`;

const getDeps = (deps) =>
  Object.entries(deps)
    .map((dep) => `${dep[0]}@${dep[1]}`)
    .toString()
    .replace(/,/g, ' ')
    .replace(/^/g, '')
    .replace(/fs-extra[^\s]+/g, '');

console.log('Initializing project...');

exec(`mkdir ${process.argv[2]} && cd ${process.argv[2]} && npm init -f`, (initErr, initStdout, initStderr) => {
  if (initErr) {
    console.error(`Error during initialization: ${initErr}`);
    return;
  }

  const packageJSON = `${process.argv[2]}/package.json`;

  // replace the default scripts
  fs.readFile(packageJSON, (err, file) => {
    if (err) throw err;

    const data = file
      .toString()
      .replace('"test": "echo \\"Error: no test specified\\" && exit 1"', scripts)
      .replace('"keywords": []', lintStaged);
    fs.writeFile(packageJSON, data, (err2) => err2 || true);
  });

  console.log('Copying over config files...');

  const filesToCopy = [
    '.babelrc',
    '.eslintignore',
    '.eslintrc.json',
    '.prettierrc',
    'commitlint.config.js',
    'jest.config.js',
    'webpack.config.js',
  ];

  for (let i = 0; i < filesToCopy.length; i += 1) {
    fs.createReadStream(path.join(__dirname, `../${filesToCopy[i]}`)).pipe(
      fs.createWriteStream(`${process.argv[2]}/${filesToCopy[i]}`),
    );
  }

  https.get('https://raw.githubusercontent.com/Kadus90/reactjs-boilerplate/main/.gitignore', (res) => {
    res.setEncoding('utf8');
    let body = '';
    res.on('data', (data) => {
      body += data;
    });
    res.on('end', () => {
      fs.writeFile(`${process.argv[2]}/.gitignore`, body, {encoding: 'utf-8'}, (err) => {
        if (err) throw err;
      });
    });
  });

  console.log('npm init -- done\n');

  // Installing dependencies
  console.log('Installing deps -- this may take a few minutes...');
  const devDeps = getDeps(packageJson.devDependencies);
  const deps = getDeps(packageJson.dependencies);
  exec(
    `cd ${process.argv[2]} && git init && node -v && npm -v && npm i -S ${deps} && npm i -D ${devDeps}`,
    (npmErr, npmStdout, npmStderr) => {
      if (npmErr) {
        console.error(`Some errors occured while installing dependencies: ${npmErr}`);
        return;
      }

      console.log(npmStdout);
      console.log('Dependencies installed');

      console.log('Copying additional files');
      fs.copy(path.join(__dirname, '../.husky'), `${process.argv[2]}/.husky`)
        .then(() => {
          console.log(`Feeling husky...`);
        })
        .catch((err) => console.error(err));

      fs.copy(path.join(__dirname, '../src'), `${process.argv[2]}/src`)
        .then(() =>
          console.log(
            `All done!\n\nYour project is now ready\n\nUse the below command to run the app.\n\ncd ${process.argv[2]}\nnpm start`,
          ),
        )
        .catch((err) => console.error(err));
    },
  );
});
