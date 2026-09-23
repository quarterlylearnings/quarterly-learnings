export type Episode = {
  title: string
  description: string
  link: string
  pubDate: string
}

/** Extract first match of a tag, handling CDATA and plain text */
function extractTag(xml: string, tag: string): string {
  const cdata = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))
  if (cdata) return cdata[1].trim()
  const plain = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))
  return plain ? plain[1].trim() : ''
}

/** Strip HTML tags from a string */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}

export async function getPodcastEpisodes(): Promise<Episode[]> {
  const res = await fetch('https://anchor.fm/s/cde5081c/podcast/rss', {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)
  const xml = await res.text()

  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? []
  return items.map(item => ({
    title: extractTag(item, 'title'),
    description: stripHtml(extractTag(item, 'description')),
    link: extractTag(item, 'link'),
    pubDate: extractTag(item, 'pubDate'),
  }))
}
