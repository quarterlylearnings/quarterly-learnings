import { LearnAuthLinks, LearnHeader } from '@/components/learn/LearnHeader'
import { RootShell, rootMetadata } from '@/components/layout/RootShell'
import { getViewer } from '@/lib/learn/payload'

export const metadata = rootMetadata

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getViewer()
  return (
    <RootShell>
      <LearnHeader actions={<LearnAuthLinks signedIn={Boolean(user)} />} />
      <main className="min-h-[calc(100vh-4rem)] bg-white">{children}</main>
    </RootShell>
  )
}
