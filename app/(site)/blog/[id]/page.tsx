import { getAllPostIds, getPostData } from '@/lib/posts'
import { Heading } from '@/components/typography/Heading'
import { Caption } from '@/components/typography/Caption'
import { Link } from '@/components/ui/Link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

type PostData = {
  id: string
  postHtml: string
  title?: string
  date?: string
  dateCreated?: string
}

export async function generateStaticParams() {
  return getAllPostIds().map((p: { params: { id: string } }) => p.params)
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = (await getPostData(id)) as PostData
  const displayDate = post.date ?? post.dateCreated

  return (
    <Section>
      <Container className="max-w-2xl mx-auto">
        <Link variant="standalone" href="/blog" className="mb-8 block">
          ← All posts
        </Link>
        <Heading level={1} className="mb-3">
          {post.title ?? post.id}
        </Heading>
        {displayDate && <Caption className="mb-10 block">{displayDate}</Caption>}
        <div
          className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:text-tertiary prose-p:font-sans prose-p:text-neutral prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-tertiary prose-strong:font-semibold"
          dangerouslySetInnerHTML={{ __html: post.postHtml }}
        />
      </Container>
    </Section>
  )
}
