import { Container } from '@/components/layout/Container'
import { Body } from '@/components/typography/Body'
import { Heading } from '@/components/typography/Heading'
import { Link } from '@/components/ui/Link'

// Rendered inside app/(ledger)/layout.tsx for notFound() calls in learner pages.
export default function LedgerNotFound() {
  return (
    <Container className="py-24">
      <Heading level={1} className="mb-4">
        We couldn’t find that page
      </Heading>
      <Body className="mb-8">The course or lesson may have moved, or it isn’t published yet.</Body>
      <Link href="/courses" variant="standalone">
        Browse courses
      </Link>
    </Container>
  )
}
