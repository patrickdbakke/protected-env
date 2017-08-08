const minimatch = require('minimatch');

function InvalidAccessError(scope, key, filename) {
  this.name = 'InvalidAccessError';
  this.message = `${fileName} tried to access ${scope}.${key}`;
  this.stack = new Error().stack;
}
InvalidAccessError.prototype = Object.create(Error.prototype);
InvalidAccessError.prototype.constructor = InvalidAccessError;

module.exports = function(rules) {
  function allowed(fileName, key) {
    const keys = Object.keys(rules);

    for (let i = 0; i < keys.length; i++) {
      if (minimatch(key, keys[i])) {
        if (!rules[key] || rules[key].indexOf('*') >= 0) {
          return true;
        }
        for (let j = 0; j < rules[key].length; j++) {
          if (minimatch(fileName, rules[key][j])) {
            return true;
          }
        }
        return false;
      }
    }
    return true;
  }

  function protect(value, name, key) {
    return function() {
      const originalPrepareStackTrace = Error.prepareStackTrace;
      const err = new Error();
      try {
        Error.prepareStackTrace = function(err, stack) {
          return stack;
        };
        err.stack.shift();
        const requester = err.stack.shift().getFileName();

        if (allowed(requester, key)) {
          return value;
        } else {
          throw new InvalidAccessError(name, key, requester);
        }
      } catch (e) {
        if (!(e instanceof InvalidAccessError)) {
          throw e;
        }
      }
      Error.prepareStackTrace = originalPrepareStackTrace;
      return value;
    };
  }

  const protectedEnv = {};
  const originalProcessEnv = process.env;
  delete process.env;

  Object.keys(originalProcessEnv).forEach(key => {
    Object.defineProperty(protectedEnv, key, {
      get: protect(originalProcessEnv[key], 'process.env', key),
      set: function() {
        throw `tried to overwrite process.env.${key}`;
      },
      enumerable: originalProcessEnv.propertyIsEnumerable(key),
    });
  });
  Object.defineProperty(process, 'env', {
    get: protect(protectedEnv, 'process', 'env'),
    configurable: true,
  });

  return function() {
    delete process.env;
    process.env = originalProcessEnv;
  };
};
