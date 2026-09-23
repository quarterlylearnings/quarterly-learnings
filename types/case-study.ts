export type CaseStudy = {
  client: string
  industry: string
  service: 'training' | 'ai-implementation'
  challenge: string
  approach: string
  outcome: string
  testimonial?: string
  /**
   * Set when this engagement was delivered while Brandon was an employee/consultant
   * of another company, rather than as a direct Quarterly Learnings client engagement.
   * Value is the employer name the work was delivered through (e.g. "Galvanize").
   * Omitted for direct QL engagements.
   */
  deliveredAsEmployeeOf?: string
}
