import { LedgerAuthLinks, LedgerHeader } from '@/components/ledger/LedgerHeader'
import { RootShell, rootMetadata } from '@/components/layout/RootShell'
import { getViewer } from '@/lib/ledger/payload'

export const metadata = rootMetadata

export default async function LedgerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getViewer()
  return (
    <RootShell>
      <LedgerHeader actions={<LedgerAuthLinks signedIn={Boolean(user)} />} />
      <main className="min-h-[calc(100vh-4rem)] bg-white">{children}</main>
    </RootShell>
  )
}
