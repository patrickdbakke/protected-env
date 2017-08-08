const protect = require('../index.js');

// https://gist.github.com/adam-lynch/11037907
function requireNoCache(filePath) {
  delete require.cache[require.resolve(filePath)];
  return require(filePath);
}

let restore;
describe('restore', () => {
  it('should reset process.env to be unprotected', () => {
    restore = protect({
      env: [],
    });
    restore();
    expect(() => {
      requireNoCache('./process-env.js');
    }).not.to.throw();
  });
});

describe('a file that matches the param exactly', () => {
  const rules = {
    env: [__dirname + '/process-env.js', __dirname + '/some-var.js'],
    SOME_VAR: [__dirname + '/some-var.js'],
  };
  describe('when accessing process.env', () => {
    beforeEach(() => {
      restore = protect(rules);
    });
    afterEach(() => {
      restore();
    });
    it('should not throw an error', () => {
      expect(() => {
        requireNoCache('./process-env.js');
      }).to.not.throw();
    });
  });
  describe('when accessing a particular key', () => {
    beforeEach(() => {
      restore = protect(rules);
    });
    afterEach(() => {
      restore();
    });
    it('should not throw an error', () => {
      expect(() => {
        requireNoCache('./some-var.js');
      }).to.not.throw();
    });
  });
});

describe('a file that matches the param via glob', () => {
  const rules = {
    env: ['**/process-env.*', '**/some-var.*'],
    SOME_VAR: ['**/some-var.*'],
  };
  describe('when accessing process.env', () => {
    beforeEach(() => {
      restore = protect(rules);
    });
    afterEach(() => {
      restore();
    });
    it('should not throw an error', () => {
      expect(() => {
        requireNoCache('./process-env.js');
      }).to.not.throw();
    });
  });
  describe('when accessing a particular key', () => {
    beforeEach(() => {
      restore = protect(rules);
    });
    afterEach(() => {
      restore();
    });
    it('should not throw an error', () => {
      expect(() => {
        requireNoCache('./some-var.js');
      }).to.not.throw();
    });
  });
});

describe("a file that's not allowed", () => {
  const rules = {
    env: [],
    SOME_VAR: [],
  };
  describe('when accessing process.env', () => {
    beforeEach(() => {
      restore = protect(rules);
    });
    afterEach(() => {
      restore();
    });
    it('should throw an error', () => {
      expect(() => {
        requireNoCache('./process-env.js');
      }).to.throw();
    });
  });
  describe('when accessing a particular key', () => {
    beforeEach(() => {
      restore = protect(rules);
    });
    afterEach(() => {
      restore();
    });
    it('should throw an error', () => {
      expect(() => {
        requireNoCache('./some-var.js');
      }).to.throw();
    });
  });
});
