const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const logger = require('../plugins/logger');
const TestExecutor = require('../core/TestExecutor');

function runTestFile(target) {
  const filepath = path.join(process.cwd(), target);
  return TestExecutor.execute(require(filepath).test);
}

function runTestDir(target) {
  const filepaths = fs.readdirSync(target).map(file => path.join(process.cwd(), target, file));
  const tests = filepaths.map(file => require(file).test).reverse();
  logger.info(`Executing following ${tests.length} tests...`);
  filepaths.forEach(filepath => logger.info(filepath));
  logger.logExecution(tests);
  return TestExecutor.executeAll(tests);
}

function runTest(argv) {
  const verboseLevel = argv.v ? 1 : 0;
  const target = argv.path;
  logger.info(`Loading test(s) in /${target}.`);
  if (fs.existsSync(target)) {
    let testReport;
    if (fs.lstatSync(target).isDirectory()) {
      testReport = runTestDir(target);
    } else if (fs.lstatSync(target).isFile()) {
      testReport = runTestFile(target);
    } else {
      const msg = `${target} is not a file nor a directory.`
      logger.error(msg);
      throw msg;
    }
    logger.logTestReport(testReport);
    TestExecutor.displayTestReport(testReport, verboseLevel);

    testReport.isPassed().then((val) => {
      if (!val) {
        logger.info('Test failed.');
        process.exitCode = 1;
      } else {
        logger.info('Test Passed.');
      }
    })
  } else {
    const msg = "Path doesn't exist.";
    logger.error(msg);
    throw msg;
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
    'run <path>',
    'Run metamorphic tests in the directory.',
    yargs => yargs.positional('path', {
      describe: 'test path to be run; if a directory, all of the test in it will be run',
      normalize: true,
    }).options({
      v: {
        alias: 'verbose',
        describe: 'Set display to verbose mode',
        boolean: true,
      }
    }),
    runTest,
  )
  .command(
    'add <path>',
    'Create new metamorphic test file with boilerplate in the specified path.',
    yargs => yargs.positional('path', {
      describe: 'path into which the new test will be created',
      normalize: true,
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
        describe: 'specifies in which directory the sample will be created',
        requiresArg: true,
        nargs: 1,
      },
    }),
    generateSample,
  )
  .example('$0 run tests', 'Run all metamorphic tests in /tests directory.')
  .example('$0 run test.js', 'Run a metamorphic tests defined in test.js.')
  .example('$0 add tests/test.js', 'Create new metamorphic test in /tests as test.js.')
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .argv;
