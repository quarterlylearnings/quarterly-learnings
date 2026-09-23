import type { CaseStudy } from '@/types/case-study'

export type CaseStudyEntry = CaseStudy & { slug: string }

export const caseStudies: CaseStudyEntry[] = [
  {
    slug: 'city-of-refuge',
    client: 'City Of Refuge',
    industry: 'Non-Profit',
    service: 'training',
    challenge:
      'A Department of Labor grant to teach web development to 20 individuals over 16 weeks.',
    approach:
      'Designed and facilitated a blended learning curriculum combining instructor-led training with project-based labs in JavaScript, React, Node.js, and Next.js, guiding student groups through design-thinking sprints to build full-stack web applications.',
    outcome:
      '95% completion rate with more than half of the students finding employment within 6 months.',
  },
  {
    slug: 'columbia-business-school',
    client: 'Columbia Business School',
    industry: 'Higher Education',
    service: 'training',
    challenge:
      'Equip emerging and experienced professionals with applied AI literacy — not just theory, but the practical skills to use LLMs and prompt engineering in day-to-day work.',
    approach:
      'Designed and taught AI Engineering Principles sessions covering Python, large language models, prompt engineering, and workflow automation, sponsored by Columbia Business School.',
    outcome:
      'Professionals across multiple cohorts left with hands-on AI literacy and workflow integration skills they could apply immediately.',
  },
  {
    slug: 'local-business-crm',
    client: 'Local Business Client',
    industry: 'Small Business / Professional Services',
    service: 'ai-implementation',
    challenge:
      'A growing local business needed a modern system of record to manage operations — plus a way to cut down the time spent manually drafting recurring documents.',
    approach:
      'Built and maintain a custom CRM on Next.js and Payload CMS backed by MongoDB, and are layering in an LLM-enabled document generation feature so admin staff can produce routine documents in a fraction of the time.',
    outcome:
      'The business now runs day-to-day operations on a system built specifically for how they work, with AI-assisted document generation currently rolling out to admin users.',
  },
  {
    slug: 'department-of-defense',
    client: 'U.S. Department of Defense',
    industry: 'Government / Defense',
    service: 'training',
    deliveredAsEmployeeOf: 'Galvanize',
    challenge:
      'Military engineering teams needed full-stack development capability and a cloud-native onboarding path for an AWS-based Air Force platform-as-a-service, delivered to strict .mil SDLC standards.',
    approach:
      'Piloted a 6-week full-stack curriculum with defined learning benchmarks and post-training assessment rubrics, built blended onboarding covering Docker and cloud-native deployment, and led 12-week JavaScript application development courses implementing CI/CD workflows aligned with DoD standards.',
    outcome:
      'The pilot curriculum directly supported securing a $60M DoD contract, with the resulting program training multiple cohorts of military developers.',
  },
  {
    slug: 'usaa',
    client: 'USAA',
    industry: 'Financial Services / Insurance',
    service: 'training',
    deliveredAsEmployeeOf: 'Galvanize',
    challenge:
      'USAA engineering teams needed hands-on technical Agile instruction, plus support translating that training into real project work.',
    approach:
      'Delivered 4 weeks of technical Agile instruction, followed by 8 weeks of embedded implementation support working directly alongside USAA engineering teams.',
    outcome:
      'Engineering teams moved from classroom instruction to applying Agile practices on live work within three months.',
  },
  {
    slug: 'the-home-depot',
    client: 'The Home Depot',
    industry: 'Retail',
    service: 'training',
    deliveredAsEmployeeOf: 'The Home Depot',
    challenge:
      'The Home Depot needed to build internal full-stack engineering capability at scale, modernize how it delivered training content, and improve throughput in its early-career hiring pipeline.',
    approach:
      'Founded Orange Method, a blended full-stack bootcamp curriculum (Angular/React, Node.js, TDD, Pivotal Cloud Foundry); led a 4-person team building technical workshops and internal L&D consulting; engineered a JAMstack curriculum-delivery platform on Gatsby.js with integrated CI/CD; and redesigned the internship and entry-level hiring process with structured group interviews.',
    outcome:
      'Orange Method scaled training to thousands of associates, and the redesigned hiring process significantly increased throughput for a 1,000-person hiring initiative.',
  },
]
