'use client'

import { Check, X } from 'lucide-react'
import { useId, useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { Radio } from '@/components/ui/Radio'

/** Grading result for one answer; mirrors payload/quiz/grade.ts QuizResult. */
export type QuizDisplayResult = {
  selectedIndex: number
  correct: boolean
  correctIndex: number
  explanation: string | null
}

export type QuizDisplayCheck = { result: QuizDisplayResult } | { error: string }

type QuizDisplayProps = {
  question: string
  options: string[]
  /** Server action bound to this lesson and question. */
  check: (selectedIndex: number) => Promise<QuizDisplayCheck>
  /** The viewer's latest saved attempt, if any. */
  initialResult?: QuizDisplayResult | null
}

/**
 * A lesson's Quiz Question block (PRD Appendix A.5). The client never knows the
 * answer until the server grades a pick: only the question and options come in.
 */
export function QuizDisplay({ question, options, check, initialResult = null }: QuizDisplayProps) {
  const name = useId()
  const [selected, setSelected] = useState<number | null>(initialResult?.selectedIndex ?? null)
  const [result, setResult] = useState<QuizDisplayResult | null>(initialResult)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onCheck() {
    if (selected === null) return
    setError(null)
    startTransition(async () => {
      const outcome = await check(selected)
      if ('error' in outcome) setError(outcome.error)
      else setResult(outcome.result)
    })
  }

  function tryAgain() {
    setResult(null)
    setSelected(null)
    setError(null)
  }

  return (
    <section className="not-prose my-8 rounded-lg border border-neutral/20 bg-neutral/5 p-6" aria-label="Quiz question">
      <fieldset disabled={pending || result !== null}>
        <legend className="mb-4 font-sans text-h4 font-medium text-tertiary">{question}</legend>
        <div className="flex flex-col gap-3">
          {options.map((option, index) => {
            const isCorrect = result?.correctIndex === index
            const isWrongPick = result !== null && !result.correct && result.selectedIndex === index
            return (
              <div key={index} className="flex flex-wrap items-center gap-3">
                <Radio
                  name={name}
                  value={index}
                  label={option}
                  checked={selected === index}
                  onChange={() => setSelected(index)}
                />
                {isCorrect && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 font-sans text-label font-medium text-secondary">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" /> Correct answer
                  </span>
                )}
                {isWrongPick && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-error/10 px-2.5 py-1 font-sans text-label font-medium text-error">
                    <X className="h-3.5 w-3.5" aria-hidden="true" /> Your answer
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </fieldset>

      <div role="status" aria-live="polite" className="mt-4">
        {result && (
          <div className="font-sans text-body text-tertiary">
            <p className="font-medium">{result.correct ? 'Correct' : 'Not quite'}</p>
            {result.explanation && <p className="mt-1 text-neutral">{result.explanation}</p>}
          </div>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-4 font-sans text-body text-error">
          {error}
        </p>
      )}

      <div className="mt-5">
        {result ? (
          <Button variant="secondary" onClick={tryAgain}>
            Try again
          </Button>
        ) : (
          <Button onClick={onCheck} disabled={selected === null} loading={pending}>
            Check answer
          </Button>
        )}
      </div>
    </section>
  )
}
