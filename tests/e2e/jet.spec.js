/*global jet describe it*/
const should = require('should');

describe('jet', () => {
  it('should provide -> global.jet', async () => {
    should(jet).not.be.undefined();
    return Promise.resolve();
  });
})
