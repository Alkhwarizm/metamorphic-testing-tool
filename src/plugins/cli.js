const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const TestExecutor = require('../core/TestExecutor');

function runTest(argv) {
  if (argv.f) {
    const filepath = path.join(process.cwd(), argv.f);
    const testReport = TestExecutor.execute(require(filepath).test);
    TestExecutor.displayTestReport(testReport);
  } else {
    const filepaths = fs.readdirSync(argv.d).map(file => path.join(process.cwd(), argv.d, file));

    const tests = filepaths.map(file => require(file).test).reverse();
    const testReports = TestExecutor.executeAll(tests);
    TestExecutor.displayAllTestReport(testReports);
  }
}

function copyTemplate(template, target) {
  const dirname = path.dirname(__dirname);
  const source = path.join(dirname, 'templates', template);
  const dest = path.join(process.cwd(), target);
  fs.copyFileSync(source, dest);
}

function initTest(argv) {
  copyTemplate('boilerplate.js', argv.path);
}

function generateSample(argv) {
  copyTemplate('sample.js', path.join(argv.d, 'mt-sample.js'));
}

/* eslint-disable no-shadow */
yargs
  .usage('Usage: $0 <command> [options]')
  .command(
    'run',
    'Run metamorphic tests in the directory.',
    yargs => yargs.options({
      d: {
        alias: 'directory',
        default: 'tests',
        describe: 'specifies metamorphic test directory to be run',
        requiresArg: true,
        nargs: 1,
      },
      f: {
        alias: 'file',
        describe: 'specifies metamorphic test file to be run',
        requiresArg: true,
      },
    }),
    runTest,
  )
  .command(
    'add <path>',
    'Create new metamorphic test file with boilerplate in the specified path.',
    yargs => yargs.positional('path', {
      describe: 'path into which the new test will be created',
      requiresArg: true,
      normalize: true,
      nargs: 1,
    }),
    initTest,
  )
  .command(
    'sample',
    'Generate an executable sample of metamorphic test file in the directory',
    yargs => yargs.options({
      d: {
        alias: 'directory',
        default: 'tests',
        describe: 'specifies metamorphic test directory to be run',
        requiresArg: true,
        nargs: 1,
      },
    }),
    generateSample,
  )
  .example('$0 run -d tests', 'Run all metamorphic tests in /tests directory.')
  .example('$0 run -f test.js', 'Run a metamorphic tests defined in test.js.')
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .argv;
