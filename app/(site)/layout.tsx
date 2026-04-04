import { Navigation } from '@/components/Navigation/Navigation'
import { Footer } from '@/components/Footer/Footer'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  )
}
