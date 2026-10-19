import type { SupportContact } from '../types'

export const SUPPORT_CONTACTS: SupportContact[] = [
  {
    id: 'therapy',
    name: 'Community counselling practice (placeholder)',
    type: 'Professional counselling and therapy',
    description:
      'A fictional card for a counselling or therapy service. Replace this with a verified local practice before any real demonstration to students who might need care.',
    contact: 'Phone: 0000 0000 — placeholder, not a real number',
    websiteNote: 'No website is linked. A verified address has not been added.',
  },
  {
    id: 'campus',
    name: 'Campus student wellbeing desk (placeholder)',
    type: 'School counsellors and student wellbeing services',
    description:
      'A stand-in for a school or university counselling centre. This prototype is not connected to NTU or any other institution.',
    contact: 'Email: wellbeing@example.invalid — placeholder, not a monitored inbox',
    websiteNote: 'No campus portal is linked.',
  },
  {
    id: 'mentor',
    name: 'A trusted adult you already know',
    type: 'Trusted adults, mentors, or seniors',
    description:
      'This might be a lecturer, mentor, residential staff member, family member, or senior student you trust. The app will not contact them for you.',
    contact: 'No phone number is stored here. Choose someone you know in real life.',
    websiteNote: 'No website applies to a personal relationship.',
  },
  {
    id: 'crisis',
    name: 'Local emergency and crisis services (unverified)',
    type: 'Crisis and emergency resources',
    description:
      'If you or someone else may be in immediate danger, contact the emergency number where you are, or go to the nearest emergency department. Ur Safe Place cannot dispatch help.',
    contact: 'Emergency number: not listed. Use the verified number for your country. Do not use 0000 0000.',
    websiteNote: 'No crisis website is linked until a real one is checked.',
  },
]
