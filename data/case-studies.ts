import type { CaseStudy } from '@/types/case-study'

export type CaseStudyEntry = CaseStudy & { slug: string }

export const caseStudies: CaseStudyEntry[] = [
  // TODO: add real case studies from DEV-28
  // {
  //   slug: 'midwest-tech-co',
  //   client: 'Midwest Tech Co.',
  //   industry: 'Technology',
  //   service: 'training',
  //   challenge: '...',
  //   approach: '...',
  //   outcome: 'Trained 12 engineers on a new CI/CD pipeline across 3 focused sessions.',
  // },
]
