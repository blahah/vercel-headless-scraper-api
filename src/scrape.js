const got = require('got')
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

export async function scrape (url) {
  let metadata = {}

  try {
    const { body: html } = await got(url)
    metadata = await metascraper({ html, url })
  } catch (e) {}

  return metadata
}

export async function scrapeall (urls) {
  const enriched = await Promise.all(urls.map(scrape))
  return enriched
}
