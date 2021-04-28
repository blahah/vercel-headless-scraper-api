const puppeteer = require('puppeteer')

// e.g. getfeed('https://memex.social/c/tEr22YvmUnYZ30vFiOL0')
export async function getfeed (sharedList) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(
    `https://memex.social/c/${sharedList}`,
    { waitUntil: 'networkidle2' }
  )

  const alldata = await page.evaluate(extract, sharedList)
  await browser.close()
  return alldata
}

async function extract (sharedList) {
  async function getSharedPages ({ sharedList }) {
    const entries = window.storage.serverStorageManager
      .collection('sharedListEntry')
      .findObjects({ sharedList })
    return entries
  }
  
  async function getAnnotationForEntry (entry) {
    const annotation = await window.storage.serverStorageManager
      .collection('sharedAnnotation')
      .findObject({ id: entry.sharedAnnotation })
    return annotation
  }
  
  async function getAnnotations ({ sharedList }) {
    const entries = await window.storage.serverStorageManager
      .collection('sharedAnnotationListEntry')
      .findObjects({ sharedList  })
    const annotate = entries.map(async entry => {
      const annotation = await getAnnotationForEntry(entry)
      entry.annotation = annotation
      return entry
    })
    const annotated = await Promise.all(annotate)
    return annotated
  }

  let pages = await getSharedPages({ sharedList })
  pages = pages.map(
    entry => {
      return {
        source: 'memex',
        type: 'link',
        id: entry.id,
        url: entry.originalUrl,
        title: entry.entryTitle,
        created: entry.createdWhen,
        updated: entry.updatedWhen
      }
    }
  )

  let annotations = await getAnnotations({ sharedList })
  annotations = annotations.map(
    entry => {
      return {
        source: 'memex',
        type: 'annotation',
        id: entry.id,
        url: 'https://' + entry.normalizedPageUrl,
        quote: entry.annotation.body,
        comment: entry.annotation.comment,
        created: entry.createdWhen,
        updated: entry.updatedWhen
      }
    }
  )

  return {
    pages, annotations
  }
}
