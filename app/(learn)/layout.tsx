import { LearnHeader } from '@/components/learn/LearnHeader'
import { RootShell, rootMetadata } from '@/components/layout/RootShell'

export const metadata = rootMetadata

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RootShell>
      <LearnHeader />
      <main className="min-h-[calc(100vh-4rem)] bg-white">{children}</main>
    </RootShell>
  )
}
