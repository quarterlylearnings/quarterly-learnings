import { Navigation } from '@/components/Navigation/Navigation'
import { Footer } from '@/components/Footer/Footer'
import { RootShell, rootMetadata } from '@/components/layout/RootShell'

export const metadata = rootMetadata

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RootShell bodyClassName="theme-site">
      <Navigation />
      <main className="pt-16">{children}</main>
      <Footer />
    </RootShell>
  )
}
