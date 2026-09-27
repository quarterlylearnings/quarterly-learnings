import type { Preview } from '@storybook/react'
import './fonts.css'
import '../app/globals.css'

const preview: Preview = {
  // Stories render in the marketing palette, matching app/(site)/layout.tsx.
  decorators: [
    (Story) => (
      <div className="theme-site">
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#14281D' },
        { name: 'neutral', value: '#f7f6f2' },
      ],
    },
  },
}

export default preview
