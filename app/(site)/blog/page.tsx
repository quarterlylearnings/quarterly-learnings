import { getSortedPostsData } from '@/lib/posts'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { BlogCard } from '@/components/BlogCard/BlogCard'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

type PostMeta = {
  id: string
  title?: string
  date?: string
  dateCreated?: string
}

export default function BlogPage() {
  const posts = getSortedPostsData() as PostMeta[]

  return (
    <>
      <PageHeader eyebrow="Writing" headline="Blog" />
      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(post => (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title ?? post.id}
                date={post.date}
                dateCreated={post.dateCreated}
              />
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
