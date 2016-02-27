import path from 'path'
import expect from 'expect.js'
import vinyl from 'vinyl-fs'
import sassGlob from '../src'
// import gulpSass from 'gulp-sass'

describe('gulp-sass-glob', () => {
  it('should parse a single directory', (done) => {
    const expectedResult = [
      '@import "import-folder/_f1.scss";',
      '@import "import-folder/_f2.scss";'
    ].join('\n')

    vinyl
      .src(path.join(__dirname, '/test-scss/app.scss'))
      .pipe(sassGlob())
      .on('data', (file) => {
        const contents = file.contents.toString('utf-8').trim()
        expect(contents).to.equal(expectedResult.trim())
      })
      .on('end', () => {
        done()
      })
  })
})
