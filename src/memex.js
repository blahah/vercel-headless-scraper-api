let chrome = {};
let puppeteer;
let opts = {}

const IN_VERCEL = !!process.env.AWS_LAMBDA_FUNCTION_VERSION

if (IN_VERCEL) {
  // running on the Vercel platform, or aws lambda
  chrome = require('chrome-aws-lambda')
  puppeteer = require('puppeteer-core')
} else {
  // running locally.
  puppeteer = require('puppeteer')
}

// open a headless browser and navigate to the memex feed page
// wait for it to load
// then run the extraction code
// e.g. getfeed('https://memex.social/c/tEr22YvmUnYZ30vFiOL0')
export async function getfeed (sharedList) {
  if (IN_VERCEL) {
    opts = {
      args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true
    }
  }
  const browser = await puppeteer.launch(opts)
  const page = await browser.newPage()
  await page.goto(
    `https://memex.social/c/${sharedList}`,
    { waitUntil: 'networkidle2' } // works for most single page apps
  )

  const alldata = await page.evaluate(extract, sharedList)
  await browser.close()
  return alldata
}

// this runs inside the headless browser
// once the page has finished loading
// it wraps several other functions - if they
// aren't included inside this function
// *they cannot be called from the headless browser*
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
