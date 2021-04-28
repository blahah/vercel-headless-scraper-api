import { getfeed } from '../../src/memex'

module.exports = async (req, res) => {
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
