import { getfeed } from '../../src/memex'
import { corsify } from '../../src/corsify'

const handler = async (req, res) => {
  const {
    query: { listId }
  } = req

  const feed = await getfeed(listId)

  res.json({
    listId,
    pages: feed.pages,
    annotations: feed.annotations
  })
}

module.exports = corsify(handler)
