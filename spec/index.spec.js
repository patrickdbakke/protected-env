const rules = {
  env: [__dirname + '/allowed-file'],
  AWS_SECRET_ACCESS_KEY: ['aws-sdk', __dirname + '/allowed-file'],
};

require('../index.js')(rules);

describe('when accessing process.env', () => {
  describe('from a malicious file', () => {
    it('should throw an error', () => {
      expect(() => {
        require('./malicious-env.js');
      }).to.throw();
    });
  });
  describe('from an allowed file', () => {
    it('should not throw an error', () => {
      expect(() => {
        require('./allowed-file.js');
      }).to.not.throw();
    });
  });
});
describe('when accessing a key on process.env', () => {
  describe('from a malicious file', () => {
    it('should throw an error', () => {
      expect(() => {
        require('./malicious-env-key.js');
      }).to.throw();
    });
  });
  describe('from an allowed file', () => {
    it('should not throw an error', () => {
      expect(() => {
        require('./allowed-file.js');
      }).to.not.throw();
    });
  });
});
