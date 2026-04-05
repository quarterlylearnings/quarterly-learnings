import { getPodcastEpisodes } from '@/lib/podcast'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Heading } from '@/components/typography/Heading'
import { Body } from '@/components/typography/Body'
import { Caption } from '@/components/typography/Caption'
import { Link } from '@/components/ui/Link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import type { Episode } from '@/lib/podcast'

export default async function PodcastPage() {
  let episodes: Episode[] = []
  let fetchError = false

  try {
    episodes = await getPodcastEpisodes()
  } catch {
    fetchError = true
  }

  return (
    <>
      <PageHeader eyebrow="Listen" headline="Podcast" />
      <Section>
        <Container className="max-w-2xl mx-auto">
          {fetchError ? (
            <StatusMessage
              variant="error"
              message="Unable to load podcast episodes right now. Please try again later."
            />
          ) : episodes.length === 0 ? (
            <StatusMessage variant="info" message="No episodes found." />
          ) : (
            <div className="flex flex-col gap-6">
              {episodes.map(ep => (
                <Card key={ep.title} variant="default">
                  <CardHeader>
                    {ep.pubDate && (
                      <Caption className="mb-2 block">
                        {new Date(ep.pubDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Caption>
                    )}
                    <Heading level={3}>{ep.title}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Body className="line-clamp-3">{ep.description}</Body>
                    <Link variant="standalone" href={ep.link} external className="mt-4 block">
                      Listen to episode
                    </Link>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
