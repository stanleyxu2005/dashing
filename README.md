# [Dashing](http://github.com/stanleyxu2005/dashing)

Dashing is a set of ready-to-use widgets, which helps you to build dashing webapps in minutes!

## Quick Start

+ Install Dashing with [npm](https://nodejs.org/).

>
```bash
$ npm install
$ gulp
```

+ Include the required libraries in your `index.html`:

>
``` html
<link rel="stylesheet" href="vendors/bootstrap/bootstrap.min.css"/>
<link rel="stylesheet" href="vendors/angular-motion/angular-motion.min.css"/>
<link rel="stylesheet" href="dashing/dashing.min.css"/>
<script src="vendors/angular/angular.min.js"></script>
<script src="vendors/angular-strap/angular-strap.min.js"></script>
<script src="vendors/angular-strap/angular-strap.tpl.min.js"></script>
<script src="vendors/smart-table/smart-table.min.js"></script>
<script src="dashing/dashing.min.js"></script>
```

+ Inject the `dashing` module into your app:

>
``` js
angular.module('myApp', ['dashing']);
```

## Author

**Qian Xu**

+ http://github.com/stanleyxu2005
