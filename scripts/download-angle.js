const https = require('https')
const os = require('os')
const path = require('path')
const tar = require('tar')
const url = require('url')

const platform = os.platform().toLowerCase()
const arch = os.arch().toLowerCase()

const baseUrl = 'https://github.com/HeadlessGL/google-angle-binaries/raw/master'
const downloadUrl = `${baseUrl}/${platform}/angle-debug-${platform}-${arch}.tar.gz`
const targetFolder = path.join(__dirname, '..', 'deps')

https.get(downloadUrl, (response) => {
  if (response.statusCode > 300 && response.statusCode < 400 && response.headers.location) {
    if (url.parse(response.headers.location).hostname) {
      https.get(response.headers.location, writeToFile)
    } else {
      https.get(url.resolve(url.parse(downloadUrl).hostname, response.headers.location), writeToFile)
    }
  } else {
    writeToFile(response)
  }
})

function writeToFile (response) {
  console.log(`downloading google angle binaries from ${downloadUrl}`)
  const contentLength = response.headers['content-length']
  let finishedLength = 0
  response
    .on('data', (chunk) => {
      finishedLength += chunk.length
      const percent = parseInt((finishedLength / contentLength) * 100)
      if (percent % 5) {
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(percent + '%')
      }
    })
    .pipe(tar.x({ C: targetFolder, strict: true }))
    .on('close', () => {
      console.log('')
      console.log('finished!')
      process.exit(0)
    })
}
