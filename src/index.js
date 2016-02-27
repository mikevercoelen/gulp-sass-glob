import path from 'path'
import fs from 'fs'
import through from 'through2'
import glob from 'glob'
// import slash from 'slash'

export default function gulpSassGlob () {
  return through.obj(transform)
}

function transform (file, env, callback) {
  // /@import\s+["']([^"']+\*(\.scss|\.sass)?)["'];?/;
  const reg = /@import\s+[\"']([^\"']*\*[^\"']*)[\"']/
  const isSass = path.extname(file.path) === '.sass'

  let contents = file.contents.toString('utf-8')

  let result

  while ((result = reg.exec(contents)) !== null) {
    // const index = result.index
    const sub = result[0]
    const globName = result[1]

    const files = glob.sync(file.base + globName)
    let replaceString = ''

    files.forEach((filename) => {
      if (filename !== file.path) {
        replaceString += process(filename, isSass)
      }
    })

    contents = contents.replace(sub, replaceString)
  }

  file.contents = new Buffer(contents)
  callback(null, file)
}

function process (filename, isSass) {
  if (!isSassOrScss(filename)) {
    return ''
  }

  filename = filename.replace(/\\/g, '/')
  return '@import "' + filename + '"' + (isSass ? '' : ';') + '\n'
}

function isSassOrScss (filename) {
  return (!fs.statSync(filename).isDirectory() && path.extname(filename).match(/\.sass|\.scss/i))
}
