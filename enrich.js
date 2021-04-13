const got = require('got')
const fs = require('fs')
const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')()
])
var ProgressBar = require('progress');

const entries = require('./data/shared_links_all_array.json')
const bar = new ProgressBar('enriching [:bar] :rate/bps :percent :success' , { total: entries.length });
const alldata = []
let n_success = 0
async function scrape (item) {
  const url = item.url
  try {
    const { body: html } = await got(url)
    let metadata = await metascraper({ html, url })
    alldata.push(Object.assign({}, item, {metadata}))
    n_success += 1
  } catch (e) {}

  bar.tick({ success: `${n_success}/${entries.length} success`})
  return Promise.resolve()
}

Promise.all(entries.map(scrape)).then(
  () => {
    fs.writeFileSync(
      './data/shared_links_all_array_enriched.json',
      JSON.stringify(alldata, null, 2)
    )
  }
)

