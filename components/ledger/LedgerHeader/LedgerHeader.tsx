import Image from 'next/image'
import NextLink from 'next/link'

/** Header for (ledger) pages. `actions` is the right-hand slot (auth links, filled in DEV-85). */
export function LedgerHeader({ actions }: { actions?: React.ReactNode }) {
  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <NextLink href="/" className="flex items-center gap-2">
            <Image src="/quarterly-learnings-logo@3x.png" alt="Quarterly Learnings" width={36} height={36} />
          </NextLink>
          <NextLink href="/courses" className="font-sans font-semibold text-tertiary hover:underline">
            Courses
          </NextLink>
        </div>
        {actions && <div className="flex items-center gap-4">{actions}</div>}
      </div>
    </header>
  )
}
