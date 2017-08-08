# 🛡 protect-env
-----------------------

A naive implementation of protecting your process.env.

Require this project as the very first project in your app.

## 🚀 Installation
Todo: add to npm.

## 🐜 Usage
```
const rules = {
	ENV_VAR_NAME: ['allowed-file.pattern'],
	ENV_VAR_NAME_2: ['package-name'],
	ENV_VAR_NAME_3: ['*'],
	env: ['global-patterns'],
}
require('protect-env')(rules)

/* ... your code ... */
```

Errors will be thrown if an unapproved library attempts to access your `process.env` or keys on it. Those libraries will **not** gain access to your protected env vars.

## 📐 Testing
```
npm run test
```

## 🖌 Linting
```
npm run prettier
```

## ⚠️ Caveats

This is a **very** naive implementation - only protecting your `process.env` using [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get). It does not protect against other ways of accessing your environment variables (like calling external code, file system `require`s, or other more "elegant" methods).

## ⚖ License
MIT
