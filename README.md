# [Dashing](https://github.com/stanleyxu2005/dashing)

[![npm version](https://badge.fury.io/js/dashing.svg)](http://badge.fury.io/js/dashing) 

**Want to be dashing? Use Dashing!** Dashing is a set of assembled widgets based on Bootstrap and AngularJS.


## Quick Start

+ Install Dashing and dependencies with [npm](https://nodejs.org/).

``` bash
$ npm install dashing

# dependencies
$ npm install bootstrap angular angular-animate angular-motion angular-strap angular-smart-table
$ npm install dashing-deps # alternative you can install echarts
```

+ Include the following lines in your `index.html`. *Note that the paths of the vendor libraries should be fixed manually for your own environment.*

``` html
<!-- styles -->
<link rel="stylesheet" href="vendors/bootstrap/bootstrap.min.css"/>
<link rel="stylesheet" href="vendors/angular-motion/angular-motion.min.css"/>
<link rel="stylesheet" href="vendors/dashing/dashing.min.css"/>
<!-- libraries -->
<script src="vendors/angular/angular.min.js"></script>
<script src="vendors/angular-animate/angular-animate.min.js"></script>
<script src="vendors/angular-strap/angular-strap.min.js"></script>
<script src="vendors/angular-strap/angular-strap.tpl.min.js"></script>
<script src="vendors/angular-smart-table/smart-table.min.js"></script>
<script src="vendors/dashing-deps/echarts/echart-all.min.js"></script>
<script src="vendors/dashing/dashing.min.js"></script>
```

+ Inject the `dashing` into your app:

``` js
angular.module('myApp', [
  'dashing'
]);
```

## Examples 

Coming soon! For the time being, [GearPump dashboard](https://github.com/gearpump/gearpump/tree/master/services/dashboard) is built with `dashing`.

## How to contribute

The project is open source. We host the code at [GitHub](https://github.com/stanleyxu2005/dashing). You can raise issues or submit PRs. Any constructive discussion is highly appreciated.

``` bash
$ git clone https://github.com/stanleyxu2005/dashing.git
$ npm install
$ gulp
```

## Author

**Qian Xu** ([GitHub](https://github.com/stanleyxu2005))


## License

The project itself is under Apache License version 2.0. You can use the library for non-commercial and commercial projects. 

All its dependencies have open source licenses as well. Please checkout their homepage for more details.

+ [AngularJS](http://angularjs.org)
+ [Angular-Strap](http://mgcrea.github.io/angular-strap)
+ [Bootstrap](http://getbootstrap.com)
+ [Echarts](http://echarts.baidu.com/)
+ [Smart-Table](http://lorenzofox3.github.io/smart-table-website/)
