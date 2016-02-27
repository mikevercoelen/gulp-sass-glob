'use strict';

var path = require('path');
var fs = require('fs');
var through = require('through2');
var glob = require('glob');

function gulpSassGlobbing() {
  function process(filename, isSass) {
    if (fs.statSync(filename).isDirectory() || !path.extname(filename).match(/\.sass|\.scss/i)) {
      return '';
    }

    filename = filename.replace(/\\/g, '/');

    return '@import "' + filename + '"' + (isSass ? '' : ';') + '\n';
  }

  function transform(file, env, callback) {
    var contents = file.contents.toString('utf-8');

    // /@import\s+["']([^"']+\*(\.scss|\.sass)?)["'];?/;
    var reg = /@import\s+[\"']([^\"']*\*[^\"']*)[\"']/;
    var isSass = path.extname(file.path) === '.sass';

    var result;

    while ((result = reg.exec(contents)) !== null) {
      var index = result.index;
      var sub = result[0];
      var globName = result[1];

      var files = glob.sync(file.base + globName);
      var replaceString = '';

      files.forEach(function (filename) {
        if (filename !== file.path) {
          replaceString += process(filename, isSass);
        }
      });

      contents = contents.replace(sub, replaceString);
    }

    file.contents = new Buffer(contents);
    callback(null, file);
  };

  return through.obj(transform);
}

module.exports = gulpSassGlobbing;
