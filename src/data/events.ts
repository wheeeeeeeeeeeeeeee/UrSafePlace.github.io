import type { EventItem, EventType } from '../types'

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  volunteering: 'Volunteering',
  discussion: 'Discussion groups',
  outing: 'Fun outings',
}

type When =
  | { kind: 'today'; hour: number; minute?: number }
  | { kind: 'weekday'; weekday: number; hour: number }
  | { kind: 'monthDay'; day: number; hour: number }
  | { kind: 'nextMonth'; day: number; hour: number }

interface EventSeed extends Omit<EventItem, 'startsAt'> {
  when: When
}

function startOfWeek(date: Date) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = copy.getDay()
  const diff = day === 0 ? 6 : day - 1
  copy.setDate(copy.getDate() - diff)
  return copy
}

function resolveWhen(when: When) {
  const now = new Date()
  if (when.kind === 'today') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), when.hour, when.minute ?? 0, 0, 0).toISOString()
  }
  if (when.kind === 'weekday') {
    const monday = startOfWeek(now)
    const date = new Date(monday)
    date.setDate(monday.getDate() + when.weekday)
    date.setHours(when.hour, 0, 0, 0)
    return date.toISOString()
  }
  if (when.kind === 'monthDay') {
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const day = Math.min(when.day, last)
    return new Date(now.getFullYear(), now.getMonth(), day, when.hour, 0, 0, 0).toISOString()
  }
  return new Date(now.getFullYear(), now.getMonth() + 1, when.day, when.hour, 0, 0, 0).toISOString()
}

const organiser = 'Fictional demo circle'

const seeds: EventSeed[] = [
  {
    id: 'ev-shore',
    title: 'Quiet shore clean-up',
    description: 'A slow morning picking up litter and noticing the tide. Gloves are part of the story, not a real kit booking.',
    type: 'volunteering',
    category: 'Environmental activities',
    when: { kind: 'weekday', weekday: 5, hour: 9 },
    durationMinutes: 120,
    location: 'East Coast Park',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-tutor',
    title: 'Peer tutoring hour',
    description: 'Sit with one topic you know well and help someone else start. A demo education circle, not a school placement.',
    type: 'volunteering',
    category: 'Tutoring and education',
    when: { kind: 'weekday', weekday: 1, hour: 16 },
    durationMinutes: 60,
    location: 'Library Quiet Room',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-pantry',
    title: 'Community pantry sort',
    description: 'Sort donated food into friendly parcels. The pantry in this prototype is fictional.',
    type: 'volunteering',
    category: 'Community service',
    when: { kind: 'weekday', weekday: 6, hour: 11 },
    durationMinutes: 90,
    location: 'Community Centre Hall',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-stories',
    title: 'Stories with younger students',
    description: 'Read aloud and leave space for questions. No real school partnership is confirmed.',
    type: 'volunteering',
    category: 'Children and youth',
    when: { kind: 'monthDay', day: 10, hour: 14 },
    durationMinutes: 75,
    location: 'Community Centre Hall',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-tea',
    title: 'Afternoon tea visit',
    description: 'A gentle conversation hour with older neighbours. Treat the address as a story setting, not a booking.',
    type: 'volunteering',
    category: 'Elderly care',
    when: { kind: 'monthDay', day: 20, hour: 15 },
    durationMinutes: 90,
    location: 'Community Centre Hall',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-shelter',
    title: 'Shelter walk and water bowls',
    description: 'A calm animal-welfare morning. The shelter named here is not a real organiser.',
    type: 'volunteering',
    category: 'Animal welfare',
    when: { kind: 'nextMonth', day: 6, hour: 10 },
    durationMinutes: 120,
    location: 'Demo Animal Shelter',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-deadlines',
    title: 'Deadline pressure circle',
    description: 'Talk about academic stress without turning it into a contest of who is coping best.',
    type: 'discussion',
    category: 'Academic stress',
    when: { kind: 'today', hour: 18, minute: 30 },
    durationMinutes: 60,
    location: 'Student Lounge',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-fog',
    title: 'Sitting with uncertainty',
    description: 'An online circle for anxiety and the fog of not knowing. Cameras optional in this fictional session.',
    type: 'discussion',
    category: 'Anxiety and uncertainty',
    when: { kind: 'weekday', weekday: 3, hour: 19 },
    durationMinutes: 60,
    location: 'Online',
    format: 'online',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-friends',
    title: 'Friendship, gently',
    description: 'A conversation about closeness, drift, and the awkward middle of student relationships.',
    type: 'discussion',
    category: 'Friendships and relationships',
    when: { kind: 'weekday', weekday: 2, hour: 18 },
    durationMinutes: 75,
    location: 'Campus Café',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-voice',
    title: 'A steadier voice',
    description: 'Practice speaking kindly about yourself before you practice speaking in class.',
    type: 'discussion',
    category: 'Self-confidence',
    when: { kind: 'monthDay', day: 12, hour: 17 },
    durationMinutes: 60,
    location: 'Online',
    format: 'online',
    cost: 5,
    organiser,
  },
  {
    id: 'ev-thanks',
    title: 'Gratitude without a performance',
    description: 'Share one true thing, or simply listen. Nobody has to feel grateful on cue.',
    type: 'discussion',
    category: 'Gratitude and purpose',
    when: { kind: 'weekday', weekday: 0, hour: 12 },
    durationMinutes: 45,
    location: 'Campus Green',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-dropin',
    title: 'General wellbeing drop-in',
    description: 'Come as you are. Stay for ten minutes or the whole hour. This drop-in is a demo, not a staffed clinic.',
    type: 'discussion',
    category: 'General wellbeing',
    when: { kind: 'today', hour: 12 },
    durationMinutes: 60,
    location: 'Student Lounge',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-walk',
    title: 'Garden path walk',
    description: 'A short nature walk at conversation pace. There is no guide and no confirmed meeting point.',
    type: 'outing',
    category: 'Nature walks and hikes',
    when: { kind: 'weekday', weekday: 4, hour: 8 },
    durationMinutes: 90,
    location: 'Botanic Garden Gate',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-cycle',
    title: 'Easy coastal cycle',
    description: 'A flat route for people who want company more than speed. Bring an imaginary helmet.',
    type: 'outing',
    category: 'Cycling',
    when: { kind: 'nextMonth', day: 12, hour: 8 },
    durationMinutes: 120,
    location: 'East Coast Park',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-kayak',
    title: 'Beginner kayak morning',
    description: 'A fictional paddle on calm water. The fee is a demo label, not a payment.',
    type: 'outing',
    category: 'Kayaking',
    when: { kind: 'nextMonth', day: 18, hour: 9 },
    durationMinutes: 150,
    location: 'East Coast Park',
    format: 'in-person',
    cost: 15,
    organiser,
  },
  {
    id: 'ev-picnic',
    title: 'Shade and sandwiches',
    description: 'A picnic with blankets and no agenda. Food in this card is not actually provided.',
    type: 'outing',
    category: 'Picnics',
    when: { kind: 'monthDay', day: 24, hour: 11 },
    durationMinutes: 120,
    location: 'Campus Green',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-games',
    title: 'Low-stakes board games',
    description: 'Play something cooperative. Winning is optional and slightly beside the point.',
    type: 'outing',
    category: 'Board games',
    when: { kind: 'today', hour: 16 },
    durationMinutes: 90,
    location: 'Student Lounge',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-museum',
    title: 'Museum wander',
    description: 'Look at one room properly instead of rushing the whole building. Tickets are not real.',
    type: 'outing',
    category: 'Museum visits',
    when: { kind: 'nextMonth', day: 9, hour: 13 },
    durationMinutes: 120,
    location: 'City Museum Steps',
    format: 'in-person',
    cost: 8,
    organiser,
  },
  {
    id: 'ev-craft',
    title: 'Paper, thread, and quiet',
    description: 'An arts afternoon for restless hands. Materials in this prototype are not supplied.',
    type: 'outing',
    category: 'Arts and crafts',
    when: { kind: 'monthDay', day: 5, hour: 14 },
    durationMinutes: 90,
    location: 'Community Centre Hall',
    format: 'in-person',
    cost: 3,
    organiser,
  },
  {
    id: 'ev-cafe',
    title: 'Café table for whoever comes',
    description: 'Share a table if you want company without a long commitment.',
    type: 'outing',
    category: 'Café meetups',
    when: { kind: 'weekday', weekday: 1, hour: 11 },
    durationMinutes: 60,
    location: 'Campus Café',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-badminton',
    title: 'Friendly badminton',
    description: 'Recreational games with rotating pairs. Skill level is “willing to laugh”.',
    type: 'outing',
    category: 'Recreational sports',
    when: { kind: 'weekday', weekday: 6, hour: 17 },
    durationMinutes: 90,
    location: 'Sports Hall',
    format: 'in-person',
    cost: 0,
    organiser,
  },
  {
    id: 'ev-online-well',
    title: 'Evening check-in online',
    description: 'A short online gathering for general wellbeing when leaving the room feels like too much.',
    type: 'discussion',
    category: 'General wellbeing',
    when: { kind: 'nextMonth', day: 3, hour: 20 },
    durationMinutes: 40,
    location: 'Online',
    format: 'online',
    cost: 0,
    organiser,
  },
]

export const EVENTS: EventItem[] = seeds.map(({ when, ...event }) => ({
  ...event,
  startsAt: resolveWhen(when),
}))

export const EVENT_LOCATIONS = Array.from(new Set(EVENTS.map((event) => event.location))).sort()
export const EVENT_CATEGORIES = Array.from(new Set(EVENTS.map((event) => event.category))).sort()
