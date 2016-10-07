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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function gulpSassGlob() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return _through2.default.obj(function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        transform.apply(undefined, args.concat([options]));
    });
}

function transform(file, env, callback) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var includePaths = options.includePaths || {};
    var reg = /^\s*@import\s+["']([^"']+\*[^"']*(\.scss|\.sass)?)["'];?$/gm;
    var isSass = _path2.default.extname(file.path) === '.sass';
    var base = _path2.default.normalize(_path2.default.join(_path2.default.dirname(file.path), '/'));

    var searchBases = [base].concat(_toConsumableArray(includePaths)).map(function (v) {
        return _path2.default.join(_path2.default.normalize(v), '/');
    });
    var contents = file.contents.toString('utf-8');
    var contentsCount = contents.split('\n').length;

    var result = void 0;

    for (var i = 0; i < contentsCount; i++) {
        result = reg.exec(contents);

        if (result !== null) {
            var files;

            var _base_path;

            (function () {
                var importRule = result[0];
                var globPattern = result[1];

                files = [];
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = searchBases[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        _base_path = _step.value;


                        files = _glob2.default.sync(_path2.default.join(_base_path, globPattern), {
                            cwd: _base_path
                        });
                        if (files.length > 0) {
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                var imports = [];

                files.forEach(function (filename) {
                    if (filename !== file.path && isSassOrScss(filename)) {
                        // remove parent base path
                        filename = _path2.default.normalize(filename).replace(_base_path, '');
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