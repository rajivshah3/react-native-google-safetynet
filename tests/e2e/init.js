/*global before beforeEach afterEach after Utils*/
/*eslint-disable no-console*/
const detox = require('detox');
const adapter = require('detox/runners/mocha/adapter');
const jet = require('jet/platform/node');
const { detox: config } = require('../package.json');

before(async () => {
  await detox.init(config);
  await jet.init();
});

beforeEach(async () => {
  await adapter.beforeEach(this);
  if (jet.context && jet.root && jet.root.setState) {
    jet.root.setState({
      currentTest: this.currentTest,
    });
  }

  const retry = this.currentTest.currentRetry();

  if (retry > 0) {
    if (retry === 1) {
      console.log('');
      console.warn('⚠️ A test failed:');
      console.warn(`️   ->  ${this.currentTest.title}`);
    }

    if (retry > 1) {
      console.warn(`   🔴  Retry #${retry - 1} failed...`);
    }

    console.warn(`️   ->  Retrying... (${retry})`);
    await Utils.sleep(3000);
  }
});

afterEach(async function () {
  await adapter.afterEach(this);
});

after(async () => {
  console.log('Cleaning up...');
  await detox.cleanup();
});
