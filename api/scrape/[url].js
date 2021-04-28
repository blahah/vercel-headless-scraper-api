import { scrape } from '../../src/scrape'
import { corsify } from '../../src/corsify'

const handler = async (req, res) => {
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

module.exports = corsify(handler)
