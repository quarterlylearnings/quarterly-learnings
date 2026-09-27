import type { Meta, StoryObj } from '@storybook/react'
import { SessionSchedule } from './SessionSchedule'

// Fixed clock so each session lands in a known window.
const now = new Date('2026-11-10T15:00:00Z')
const at = (iso: string) => new Date(iso).toISOString()

const meta: Meta<typeof SessionSchedule> = {
  title: 'Ledger/SessionSchedule',
  component: SessionSchedule,
  parameters: { layout: 'padded' },
  args: { now },
  decorators: [(Story) => <div className="max-w-2xl">{Story()}</div>],
}

export default meta
type Story = StoryObj<typeof SessionSchedule>

export const AllStates: Story = {
  args: {
    sessions: [
      {
        id: 'ended',
        title: 'Kickoff',
        startsAt: at('2026-11-03T17:00:00Z'),
        endsAt: at('2026-11-03T18:30:00Z'),
        timezone: 'America/New_York',
      },
      {
        id: 'open',
        title: 'Tools Walkthrough',
        startsAt: at('2026-11-10T17:00:00Z'),
        endsAt: at('2026-11-10T18:30:00Z'),
        timezone: 'America/New_York',
        classLink: 'https://meet.example.com/walkthrough',
      },
      {
        id: 'later',
        title: 'Team Rollout Clinic',
        startsAt: at('2026-11-17T17:00:00Z'),
        endsAt: at('2026-11-17T18:30:00Z'),
        timezone: 'Europe/London',
      },
    ],
  },
}

export const NoSessionsYet: Story = { args: { sessions: [] } }
