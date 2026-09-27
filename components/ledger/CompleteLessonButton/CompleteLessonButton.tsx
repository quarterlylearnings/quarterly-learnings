'use client'

import { CheckCircle } from 'lucide-react'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'

export type CompleteLessonResult = { completed: true } | { error: string }

type CompleteLessonButtonProps = {
  /** Server action bound to this lesson. */
  complete: () => Promise<CompleteLessonResult>
  initiallyCompleted?: boolean
}

/**
 * "Mark complete" for a lesson (PRD Appendix A.5). The lesson page renders it
 * only for learners with access, so there is no logged-out state here.
 */
export function CompleteLessonButton({ complete, initiallyCompleted = false }: CompleteLessonButtonProps) {
  const [completed, setCompleted] = useState(initiallyCompleted)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onClick() {
    setError(null)
    startTransition(async () => {
      const outcome = await complete()
      if ('error' in outcome) setError(outcome.error)
      else setCompleted(true)
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {completed ? (
        <p role="status" className="inline-flex items-center gap-2 font-sans text-body font-medium text-secondary">
          <CheckCircle className="h-5 w-5" aria-hidden="true" /> Completed
        </p>
      ) : (
        <Button variant="secondary" onClick={onClick} loading={pending}>
          Mark complete
        </Button>
      )}
      {error && (
        <p role="alert" className="font-sans text-small text-error">
          {error}
        </p>
      )}
    </div>
  )
}
