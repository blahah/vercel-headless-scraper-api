import { scrape } from '../../src/scrape'

module.exports = async (req, res) => {
  const {
    query: { url }
  } = req

  const parsedurl = decodeURIComponent(url)
  const metadata = await scrape(parsedurl)

  res.json({
    url,
    metadata
  })
}
