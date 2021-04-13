const puppeteer = require('puppeteer')
const fs = require('fs')

async function run () {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(
    'https://memex.social/c/brSDj3EQ7TTtqBLRFknj', {
    waitUntil: 'networkidle2',
  })

  const alldata = await page.evaluate(extract)
  fs.writeFileSync('./data/alldata.json', JSON.stringify(alldata))
  await browser.close()
}

async function extract () {
  async function fetchCollection (colname) {
    return window.storage.serverStorageManager.collection(
      colname
    ).findAllObjects()
  }

  const colnames = [
    "sharedListEntry",
    "sharedPageInfo",
    "sharedAnnotation",
    "sharedAnnotationListEntry",
  ]

  return Promise.all(colnames.map(fetchCollection))
}

run()