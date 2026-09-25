import NextLink from 'next/link'
import { logoutAction } from '@/app/(ledger)/(auth)/actions'
import { Button } from '@/components/ui/Button'

const linkClass = 'font-sans text-small font-medium text-tertiary hover:underline'

/** Right-hand side of LedgerHeader: log in / sign up, or account / log out. */
export function LedgerAuthLinks({ signedIn }: { signedIn: boolean }) {
  if (!signedIn) {
    return (
      <>
        <NextLink href="/login" className={linkClass}>
          Log in
        </NextLink>
        <Button as="a" href="/signup" size="sm">
          Sign up
        </Button>
      </>
    )
  }
  return (
    <>
      <NextLink href="/account" className={linkClass}>
        Account
      </NextLink>
      <form action={logoutAction}>
        <Button type="submit" variant="ghost" size="sm">
          Log out
        </Button>
      </form>
    </>
  )
}
