import path from 'path'
import fs from 'fs'
import through from 'through2'
import glob from 'glob'
import slash from 'slash'

export default function gulpSassGlob () {
  return through.obj(transform)
}

function transform (file, env, callback) {
  const reg = /^\s*@import\s+["']([^"']+\*(\.scss|\.sass)?)["'];?$/gm
  const isSass = path.extname(file.path) === '.sass'
  const base = path.normalize(path.join(path.dirname(file.path), '/'))

  let contents = file.contents.toString('utf-8')

  let result

  while ((result = reg.exec(contents)) !== null) {
    const importRule = result[0]
    const globPattern = result[1]

    const files = glob.sync(path.join(base, globPattern), {
      cwd: base
    })

    let imports = []

    files.forEach((filename) => {
      if (filename !== file.path && isSassOrScss(filename)) {
        // remove parent base path
        filename = path.normalize(filename).replace(base, '')
        imports.push('@import "' + slash(filename) + '"' + (isSass ? '' : ';'))
      }
    })

    const replaceString = imports.join('\n')
    contents = contents.replace(importRule, replaceString)
    // `reg.lastIndex` indicates the last character of the `contents` when `reg`
    // matched. Since we remove this line we have to rewind the index to make
    // it go though all characters of the added lines. If it's not done then
    // a false positive of `reg.exec(contents) == null` occurs before all lines
    // of the file are processed because `reg` starts from somewhere in the
    // middle of last `replaceString` instead of the very beginning of it.
    reg.lastIndex -= importRule.length;
    file.contents = new Buffer(contents)
  }

  callback(null, file)
}

function isSassOrScss (filename) {
  return (!fs.statSync(filename).isDirectory() && path.extname(filename).match(/\.sass|\.scss/i))
}
