# get-image
get-image is a simple module that creates a preloaded `<img>` for a given src.

[![Build status](https://travis-ci.org/michaelrhodes/get-image.svg?branch=master)](https://travis-ci.org/michaelrhodes/get-image)

[![Browser support](https://ci.testling.com/michaelrhodes/get-image.png)](https://ci.testling.com/michaelrhodes/get-image)

## Install

``` sh
$ npm install get-image
```
**note: canvas is not installed alongside get-image**

get-image requires [automattic/node-canvas](https://github.com/automattic/node-canvas) for its server/node variant, however, to avoid browser-only users from having to endure the native compilation process, it needs to be npm installed separately.

## Usage

### Browser & Server
``` js
var image = require('get-image')

image('./image.jpg', function(error, img) {
  document.body.appendChild(img)
})
```

### License
[MIT](http://opensource.org/licenses/MIT)
