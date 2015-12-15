var path = require('path');
var fs = require('fs');
var through = require('through2');
var glob = require('glob');

function gulpSassGlobbing () {
  function process (filename) {
    var replaceString = '';

    if (fs.statSync(filename).isDirectory()) {
      // Ignore directories start with _
      if (path.basename(filename).substring(0, 1) == '_') {
        return '';
      }

      fs.readdirSync(filename).forEach(function (file) {
        replaceString += process(filename + path.sep + file);
      });

      return replaceString;
    }

    if (filename.substr(-4).match(/sass|scss/i)) {
      filename = filename.replace(/\\/g, '/');
      return '@import "' + filename + '";\n'
    }

    return '';
  }

  function transform (file, env, callback) {
    var contents = file.contents.toString('utf-8');

    var reg = /@import\s+\"([^\"]*\*[^\"]*)\"/;
    var result;

    while((result = reg.exec(contents)) !== null) {
      var index = result.index;
      var sub = result[0];
      var globName = result[1];

      var files = glob.sync(file.base + globName);
      var replaceString = '';

      files.forEach(function (filename) {
        replaceString += process(filename);
      });

      contents = contents.replace(sub, replaceString);
    }

    file.contents = new Buffer(contents);
    callback(null, file);
  };

  return through.obj(transform);
}

module.exports = gulpSassGlobbing;