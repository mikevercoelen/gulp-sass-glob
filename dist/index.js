'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = gulpSassGlob;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _slash = require('slash');

var _slash2 = _interopRequireDefault(_slash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function gulpSassGlob() {
  return _through2.default.obj(transform);
}

function transform(file, env, callback) {
  var reg = /^\s*@import\s+["']([^"']+\*[^"']*(\.scss|\.sass)?)["'];?$/gm;
  var isSass = _path2.default.extname(file.path) === '.sass';
  var base = _path2.default.normalize(_path2.default.join(_path2.default.dirname(file.path), '/'));

  var contents = file.contents.toString('utf-8');
  var contentsCount = contents.split('\n').length;

  var result = void 0;

  for (var i = 0; i < contentsCount; i++) {
    result = reg.exec(contents);

    if (result !== null) {
      (function () {
        var importRule = result[0];
        var globPattern = result[1];

        var files = _glob2.default.sync(_path2.default.join(base, globPattern), {
          cwd: base
        });

        var imports = [];

        files.forEach(function (filename) {
          if (filename !== file.path && isSassOrScss(filename)) {
            // remove parent base path
            filename = _path2.default.normalize(filename).replace(base, '');
            imports.push('@import "' + (0, _slash2.default)(filename) + '"' + (isSass ? '' : ';'));
          }
        });

        var replaceString = imports.join('\n');
        contents = contents.replace(importRule, replaceString);
        file.contents = new Buffer(contents);
      })();
    }
  }

  callback(null, file);
}

function isSassOrScss(filename) {
  return !_fs2.default.statSync(filename).isDirectory() && _path2.default.extname(filename).match(/\.sass|\.scss/i);
}
module.exports = exports['default'];