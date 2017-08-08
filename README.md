# 🛡 protect-env
-----------------------

A naive implementation of protecting your process.env.

Avoid [malicious packages](https://twitter.com/o_cee/status/892306836199800836) and [hackerz](https://media2.giphy.com/media/TOWeGr70V2R1K/giphy.gif). Restrict `process.env` access to authorized libraries only. 

## 🚀 Installation
Todo: add to npm.

## 🐜 Usage

Require this project as the very [first line](https://media1.giphy.com/media/AJP3hFHIJGne0/giphy.gif) in your app.

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

Errors will be thrown if an [unapproved library](https://media0.giphy.com/media/Bc3SkXz1M9mjS/giphy.gif) attempts to access your `process.env` or keys on it. Those libraries will **not** gain access to your protected env vars.

## ⚠️ Caveats

This is a **very** naive implementation - only protecting your `process.env` using [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get). It does not protect against [other ways](https://media.giphy.com/media/lOzXuHwXXYM9y/giphy.gif) of accessing your environment variables (like calling external code, file system `require`s, or other more elegant methods).

## 📐 Testing
```
npm run test
```

## 🖌 Linting
```
npm run prettier
```

## ✅ Todo

1. Glob style file path matching. 
2. Wildcard var names (`*SECRET*`, `*PASSWORD*`)
3. NPM
4. [More giphy](https://media.giphy.com/media/n5oYbKrHYXylq/giphy.gif)
5. More emoji

## ⚖ License
MIT
