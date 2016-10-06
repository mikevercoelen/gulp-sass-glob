import path from 'path'
import fs from 'fs'
import through from 'through2'
import glob from 'glob'
import slash from 'slash'

export default function gulpSassGlob(options = {}) {
    return through.obj((...args) => {
        transform(...args, options)
    })
}

function transform(file, env, callback, options = {}) {
    const includePaths = options.includePaths || [];
    for (let i = 0; i < includePaths.length; i++) {
        includePaths[i] = path.join(path.normalize(includePaths[i]), '/')
    }

    const reg = /^\s*@import\s+["']([^"']+\*[^"']*(\.scss|\.sass)?)["'];?$/gm
    const isSass = path.extname(file.path) === '.sass'
    const base = path.normalize(path.join(path.dirname(file.path), '/'))


    const searchBases = [base, ...includePaths]
    let contents = file.contents.toString('utf-8')
    let contentsCount = contents.split('\n').length

    let result

    for (var i = 0; i < contentsCount; i++) {
        result = reg.exec(contents)

        if (result !== null) {
            const importRule = result[0]
            const globPattern = result[1]

            var files = [];
            var _base_path;
            for (let i = 0; i < searchBases.length; i++) {
                _base_path = searchBases[i];

                files = glob.sync(path.join(_base_path, globPattern), {
                    cwd: _base_path
                })
                if (files.length > 0) {
                    break
                }
            }

            let imports = []

            files.forEach((filename) => {
                if (filename !== file.path && isSassOrScss(filename)) {
                    // remove parent base path
                    filename = path.normalize(filename).replace(_base_path, '');
                    imports.push('@import "' + slash(filename) + '"' + (isSass ? '' : ';'))
                }
            })

            const replaceString = imports.join('\n')
            contents = contents.replace(importRule, replaceString)
            file.contents = new Buffer(contents)
        }
    }

    callback(null, file)
}

function isSassOrScss(filename) {
    return (!fs.statSync(filename).isDirectory() && path.extname(filename).match(/\.sass|\.scss/i))
}
