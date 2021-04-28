# memex-feed-parser

- [memex-feed-parser](#memex-feed-parser)
  - [API](#api)
    - [`GET /api/memex/[sharedListId]`](#get-apimemexsharedlistid)
      - [Example](#example)
    - [`get /api/scrape/[url]`](#get-apiscrapeurl)
      - [Example](#example-1)

## API

### `GET /api/memex/[sharedListId]`

Retrieve the Memex shared feed with the provided ID, and return the entries as structured data.

The response has the form:

```json
{
  "listId": "", // the same listId you provided
  "pages": [],
  "annotations": []
}
```

Each entry in `pages` takes the form:

```json
{
  "source": "memex",
  "type": "link",
  "url": "", // the URL
  "title": "", // the page title
  "created": 1618345214065, // as Unix Timestamp (milliseconds)
  "updated": 1618345214065
}
```

Each entry in `annotations` takes the form:

```json

```

#### Example

The query:

`GET /api/memex/tEr22YvmUnYZ30vFiOL0`

Returns the response:

> note: entries omitted for brevity

```json
{
  "listId": "tEr22YvmUnYZ30vFiOL0",
  "pages": [{
    "source": "memex",
    "type": "link",
    "url": "https://jackrusher.com/journal/what-does-it-mean-to-buy-a-gif.html",
    "title": "What Does It Mean To Buy a Gif? | Jack Rusher",
    "created": 1618345214065,
    "updated": 1618345214065
  },
  ...
  ],
  "annotations": [{
    "source": "memex",
    "type": "annotation",
    "url": "https://jackrusher.com/journal/what-does-it-mean-to-buy-a-gif.html",
    "quote": "The top performers are so homogeneous that NYC’s galleries show more art by people who went to Yale than by all minorities combined. In addition to inequalities along race, class, and gender lines for those born in the rich world, artists born in countries without elite institutions are essentially barred from success.\n\nWe might well ask what service the gatekeepers who operate these markets provide to make up for these shortcomings. One argument is that they have the taste and education to allocate capital wisely, thus rewarding the highest quality art.\n\n",
    "comment": "",
    "created": 1616803866655,
    "updated": 1618346658307
  },
  ...
  ]
}
```

### `get /api/scrape/[url]`

Scrape the URL and return structured metadata.

#### Example

The query:

`GET /api/scrape/https%3A%2F%2Fwww.theguardian.com%2Fenvironment%2F2021%2Fapr%2F28%2Fspeed-at-which-worlds-glaciers-are-melting-has-doubled-in-20-years`

Returns the response:

```json
{
  "url": "https://www.theguardian.com/environment/2021/apr/28/speed-at-which-worlds-glaciers-are-melting-has-doubled-in-20-years",
  "metadata": {
    "author": "Jonathan Watts",
    "date": "2021-04-28T16:22:42.000Z",
    "description": "Glacier melt contributing more to sea-level rise than loss of Greenland and Antarctic ice sheets, say experts",
    "image": "https://i.guim.co.uk/img/media/7ee51e31092088a3079012acf57ddc71c45930b5/0_117_3500_2100/master/3500.jpg?width=1200&height=630&quality=85&auto=format&fit=crop&overlay-align=bottom%2Cleft&overlay-width=100p&overlay-base64=L2ltZy9zdGF0aWMvb3ZlcmxheXMvdGctZGVmYXVsdC5wbmc&enable=upscale&s=3a8bd91a62cd8ca8dcf21e83feaae84a",
    "logo": "https://uploads.guim.co.uk/2018/01/31/TheGuardian_AMP.png",
    "publisher": "The Guardian",
    "title": "Speed at which world’s glaciers are melting has doubled in 20 years",
    "url": "http://www.theguardian.com/environment/2021/apr/28/speed-at-which-worlds-glaciers-are-melting-has-doubled-in-20-years"
  }
}
```