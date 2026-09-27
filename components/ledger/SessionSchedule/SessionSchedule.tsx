import { ExternalLink } from 'lucide-react'
import { Caption } from '@/components/typography/Caption'
import { Button } from '@/components/ui/Button'
import { formatSessionTime } from '@/lib/ledger/format'
import { classLinkWindow } from '@/payload/utilities/sessions'

export type ScheduleSession = {
  id?: string | null
  title: string
  startsAt: string
  endsAt: string
  timezone: string
  /** Present only while the viewer may see it (field access on offerings). */
  classLink?: string | null
}

type SessionScheduleProps = {
  sessions: ScheduleSession[]
  /** Evaluation time; defaults to now. */
  now?: Date
}

/**
 * An enrolled learner's session list (PRD §3.4 R10): times in each session's
 * own time zone; "Ended" once over; the class link from 24 hours before the
 * start; otherwise the date only.
 */
export function SessionSchedule({ sessions, now = new Date() }: SessionScheduleProps) {
  const ordered = [...sessions].sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  if (ordered.length === 0) {
    return <Caption as="p">Session dates will be listed here once they’re scheduled.</Caption>
  }

  return (
    <ol className="divide-y divide-neutral/20 border-y border-neutral/20">
      {ordered.map((session, index) => {
        const linkWindow = classLinkWindow(session, now)
        return (
          <li key={session.id ?? index} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="font-sans font-medium text-tertiary">{session.title}</p>
              <Caption as="p">{formatSessionTime(session.startsAt, session.endsAt, session.timezone)}</Caption>
            </div>
            {linkWindow === 'ended' && <Caption>Ended</Caption>}
            {linkWindow === 'open' && session.classLink && (
              <Button as="a" href={session.classLink} target="_blank" rel="noopener noreferrer" size="sm">
                Join class <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">(opens in new tab)</span>
              </Button>
            )}
            {linkWindow === 'upcoming' && <Caption>Class link opens 24 hours before</Caption>}
          </li>
        )
      })}
    </ol>
  )
}
