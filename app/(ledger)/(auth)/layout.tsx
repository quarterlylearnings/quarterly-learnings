/** Narrow, centered column for the log in / sign up / password pages. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-md px-6 py-16">{children}</div>
}
