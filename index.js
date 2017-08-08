function InvalidAccessError(scope, key, filename) {
  this.name = 'InvalidAccessError';
  this.message = fileName + ' tried to access ' + scope + '.' + key;
  this.stack = new Error().stack;
}
InvalidAccessError.prototype = Object.create(Error.prototype);
InvalidAccessError.prototype.constructor = InvalidAccessError;

module.exports = function(rules) {
  function allowed(fileName, key) {
    if (
      !rules[key] ||
      rules[key].length === 0 ||
      rules[key].indexOf('*') >= 0
    ) {
      return true;
    }
    for (let i = 0; i < rules[key].length; i++) {
      if (fileName.indexOf(rules[key][i]) >= 0) {
        return true;
      }
    }
    return false;
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
  Object.keys(process.env).forEach(key => {
    Object.defineProperty(protectedEnv, key, {
      get: protect(process.env[key], 'process.env', key),
      enumerable: process.env.propertyIsEnumerable(key),
    });
  });
  delete process.env;
  Object.defineProperty(process, 'env', {
    get: protect(protectedEnv, 'process', 'env'),
    set: function() {
      throw 'tried to overwrite env';
    },
  });
};
