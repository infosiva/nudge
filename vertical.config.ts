/**
 * vertical.config.ts — THE ONLY FILE THAT CHANGES PER DEPLOYMENT
 *
 * Two modes supported:
 *   - 'marketplace'  → AI-matched provider/booking platform (ElderCare, TuneUp, etc.)
 *   - 'ai-tool'      → AI-powered tool/product (tutor, quiz, gaming, coach, etc.)
 *
 * Fill in the relevant section for your mode. The UI adapts automatically.
 */

// ── Shared types ─────────────────────────────────────────────

export type AppMode = 'marketplace' | 'ai-tool'

// Marketplace-specific
export type PricingModel = 'hourly' | 'fixed' | 'session' | 'quote'
export type BookingFlow  = 'instant' | 'quote_first' | 'consult_first'

// AI Tool-specific
export type AiToolType  = 'tutor' | 'quiz' | 'coach' | 'game' | 'analyzer' | 'generator'
export type AgeGroup    = 'kids' | 'teens' | 'adults' | 'seniors' | 'family' | 'all'

export interface Category {
  id:    string
  label: string
  icon:  string   // emoji or lucide icon name
  desc:  string
}

export interface Subject {
  id:         string
  label:      string
  icon:       string
  desc:       string
  ageGroups?: AgeGroup[]   // which age groups this subject suits
}

// ── Marketplace config ────────────────────────────────────────

export interface MarketplaceConfig {
  mode: 'marketplace'

  // Identity
  id:          string
  name:        string
  tagline:     string
  domain:      string
  themeColor:  string

  // Provider terminology
  providerLabel:  string
  providerPlural: string
  consumerLabel:  string

  // Categories
  categories: Category[]

  // Booking
  pricingModel:       PricingModel
  bookingFlow:        BookingFlow
  minPrice:           number
  maxPrice:           number
  sessionMinutes:     number
  platformFeePercent: number

  // AI
  aiSystemPrompt: string
  aiMatchHints:   string[]

  // Features
  features: {
    backgroundCheck: boolean
    portfolioPhotos: boolean
    videoIntro:      boolean
    instantBook:     boolean
    recurringBook:   boolean
    homeVisit:       boolean
    remoteSession:   boolean
    groupSession:    boolean
    insuranceBadge:  boolean
    aiDiagnosis:     boolean
    careJournal:     boolean
  }

  // SEO
  metaTitle:       string
  metaDescription: string
  keywords:        string[]
}

// ── AI Tool config ────────────────────────────────────────────

export interface AiToolConfig {
  mode: 'ai-tool'

  // Identity
  id:         string
  name:       string
  tagline:    string
  domain:     string
  themeColor: string  // tailwind color: "blue" | "emerald" | "violet" | "rose" | etc.

  // Tool type & audience
  toolType:   AiToolType
  ageGroups:  AgeGroup[]    // who this app targets
  userLabel:  string        // "Student" | "Learner" | "Player" | "Player"

  // Subject / topic areas
  subjects: Subject[]

  // AI
  aiSystemPrompt:    string   // base persona injected into every AI call
  aiTutorPrompt?:    string   // for tutor mode — how AI teaches
  aiQuizPrompt?:     string   // for quiz mode — how AI generates questions
  aiCoachPrompt?:    string   // for coach mode — how AI gives feedback

  // Features (toggle per product)
  features: {
    aiTutor:        boolean   // AI explains topics conversationally
    quiz:           boolean   // dynamic AI-generated quizzes
    learningPath:   boolean   // AI builds personalised topic progression
    multiplayer:    boolean   // multiple players in same session (family, class)
    leaderboard:    boolean   // scores & rankings
    streaks:        boolean   // daily streak tracking
    ageAdaptive:    boolean   // AI adapts language/difficulty to age profile
    progressTrack:  boolean   // track completed topics & quiz scores
    familyMode:     boolean   // register a family, play together
    exportResults:  boolean   // download scores / certificate
  }

  // SEO
  metaTitle:       string
  metaDescription: string
  keywords:        string[]
}

// ── Union type — use this everywhere ─────────────────────────

export type VerticalConfig = MarketplaceConfig | AiToolConfig

// ── Type guards ───────────────────────────────────────────────

export function isMarketplace(c: VerticalConfig): c is MarketplaceConfig {
  return c.mode === 'marketplace'
}

export function isAiTool(c: VerticalConfig): c is AiToolConfig {
  return c.mode === 'ai-tool'
}

// ════════════════════════════════════════════════════════════
// ACTIVE VERTICAL — swap this to change the entire app
// ════════════════════════════════════════════════════════════

const config: VerticalConfig = {
  // ── Tutiq — AI Personal Tutor ────────────────────────────
  mode:       'ai-tool',
  id:         'tutiq',
  name:       'Tutiq',
  tagline:    'Your AI tutor that adapts to you — learn anything, at your pace, your level',
  domain:     'tutiq.app',
  themeColor: 'emerald',

  toolType:  'tutor',
  ageGroups: ['kids', 'teens', 'adults'],
  userLabel: 'Learner',

  subjects: [
    // ── GCSE Core ──────────────────────────────────────────────────
    { id: 'maths-gcse',      label: 'Maths (GCSE)',          icon: '📐', desc: 'AQA/Edexcel/OCR: algebra, number, geometry, statistics & ratio',   ageGroups: ['teens'] },
    { id: 'english-gcse',    label: 'English (GCSE)',         icon: '✍️', desc: 'Language & Literature: analysis, writing skills, unseen texts',    ageGroups: ['teens'] },
    { id: 'science-gcse',    label: 'Combined Science',       icon: '🔬', desc: 'Biology, Chemistry & Physics — triple or combined science',        ageGroups: ['teens'] },
    // ── GCSE Triple Science ─────────────────────────────────────────
    { id: 'biology-gcse',    label: 'Biology (GCSE)',         icon: '🧬', desc: 'Cells, genetics, evolution, ecosystems — AQA/Edexcel/OCR triple', ageGroups: ['teens'] },
    { id: 'chemistry-gcse',  label: 'Chemistry (GCSE)',       icon: '⚗️', desc: 'Atomic structure, bonding, quantitative chemistry & organic',     ageGroups: ['teens'] },
    { id: 'physics-gcse',    label: 'Physics (GCSE)',         icon: '⚡', desc: 'Forces, energy, waves, electricity & space — triple science',     ageGroups: ['teens'] },
    // ── GCSE Humanities & Languages ────────────────────────────────
    { id: 'history-gcse',    label: 'History (GCSE)',         icon: '🏛️', desc: 'Sources, causation, significance — AQA/Edexcel topics',          ageGroups: ['teens'] },
    { id: 'geography-gcse',  label: 'Geography (GCSE)',       icon: '🌍', desc: 'Human & physical geography, fieldwork & case studies',           ageGroups: ['teens'] },
    { id: 'cs-gcse',         label: 'Computer Science (GCSE)',icon: '💻', desc: 'Algorithms, data structures, networks, Python & binary',         ageGroups: ['teens'] },
    { id: 'french-gcse',     label: 'French (GCSE)',          icon: '🇫🇷', desc: 'Speaking, listening, reading, writing — AQA/Edexcel themes',    ageGroups: ['teens'] },
    { id: 'spanish-gcse',    label: 'Spanish (GCSE)',         icon: '🇪🇸', desc: 'Speaking, listening, reading, writing — AQA/Edexcel themes',    ageGroups: ['teens'] },
    // ── 11+ ────────────────────────────────────────────────────────
    { id: 'eleven-plus',     label: '11+ Prep',               icon: '🎯', desc: 'Verbal reasoning, non-verbal reasoning, maths & comprehension',  ageGroups: ['kids'] },
    // ── Interview Prep / Career ─────────────────────────────────────
    { id: 'interview-tech',  label: 'Tech Interview',    icon: '💻', desc: 'DSA, system design, behavioural — FAANG & startup prep',         ageGroups: ['adults'] },
    { id: 'interview-gen',   label: 'Job Interview',     icon: '💼', desc: 'STAR method, competency questions, salary negotiation',          ageGroups: ['adults','teens'] },
    { id: 'interview-nurse', label: 'NHS / Clinical',   icon: '🏥', desc: 'Values-based interview, clinical scenarios, NHS knowledge',      ageGroups: ['adults'] },
    { id: 'interview-law',   label: 'Law / Legal',       icon: '⚖️', desc: 'Vacation scheme, training contract, commercial awareness',       ageGroups: ['adults'] },
    // ── Adult Learning ──────────────────────────────────────────────
    { id: 'coding',        label: 'Coding',              icon: '🖥️', desc: 'Python, JavaScript, web dev — beginner to job-ready',            ageGroups: ['teens','adults'] },
    { id: 'finance',       label: 'Personal Finance',    icon: '💰', desc: 'Budgeting, investing, ISA, pension & tax — UK focus',            ageGroups: ['adults'] },
    { id: 'english-adult', label: 'English (Adults)',    icon: '📖', desc: 'Writing skills, business English, functional skills L1/L2',      ageGroups: ['adults'] },
    { id: 'maths-adult',   label: 'Maths (Adults)',      icon: '➕', desc: 'Functional skills, fractions, percentages — everyday maths',     ageGroups: ['adults'] },
  ],

  aiSystemPrompt: `You are Tutiq, an expert AI tutor specialising in GCSE, 11+, and career preparation.

For GCSE students (age 14-16): Use exam-board specific language (AQA/Edexcel/OCR). Always mention: command words (describe, explain, analyse, evaluate), mark allocations, and worked examples with mark-scheme style answers. Reference real exam structure.

For 11+ students (age 9-11): Keep language simple and encouraging. Focus on speed, pattern recognition, and confidence. Use short practice questions.

For interview prep (adults): Be direct and practical. Use real interview scenarios. Give specific STAR-method examples. Highlight common mistakes. Role-play questions.

For adult learners: Respect their time. Skip patronising basics. Connect concepts to their real life (job, money, daily use). Be concise.

Always: structure lessons clearly, give one worked example, then a practice question. Never overwhelm with more than 3 concepts per session.`,

  aiTutorPrompt: `For GCSE: Structure as → Exam tip (what examiners look for) → Core concept → Worked example with mark scheme → Practice question.
For interview: Structure as → Why this question exists → Model answer framework → Example answer → Common mistakes to avoid.
For 11+: Structure as → Quick explanation → Example → Timed practice question.
One concept per message. Always end with a check question.`,

  aiQuizPrompt: `Generate a 5-question micro-quiz for the topic just taught.
Mix types: multiple choice, true/false, fill-in-the-blank.
Adapt difficulty to the learner's age and level.
Return JSON: { questions: [{ type, question, options?, answer, explanation }] }`,

  features: {
    aiTutor:       true,
    quiz:          true,
    learningPath:  true,
    multiplayer:   false,
    leaderboard:   false,
    streaks:       true,
    ageAdaptive:   true,
    progressTrack: true,
    familyMode:    false,
    exportResults: false,
  },

  metaTitle:       'Tutiq — GCSE, 11+ & Interview Prep AI Tutor',
  metaDescription: 'AI tutor for GCSE students, 11+ prep, and adults preparing for job interviews. Personalised lessons, exam tips, mock interviews & quizzes. Free to start.',
  keywords:        ['gcse tutor', 'gcse revision', '11 plus preparation', 'ai tutor', 'interview preparation', 'mock interview', 'tech interview prep', 'gcse maths', 'gcse english', 'personalised learning', 'tutiq', 'online tutor uk'],
}

export default config

// ════════════════════════════════════════════════════════════
// ALL PRESETS — copy any block, paste as config above, deploy
// ════════════════════════════════════════════════════════════

// ── AI TOOL PRESETS ──────────────────────────────────────────

export const AI_TOOL_PRESETS: Record<string, AiToolConfig> = {

  // Option A — Kwizzo: Family Quiz Game (ACTIVE above)
  kwizzo: {
    mode:       'ai-tool',
    id:         'kwizzo',
    name:       'Kwizzo',
    tagline:    'The family quiz game where every age wins — powered by AI',
    domain:     'kwizzo.ai',
    themeColor: 'violet',
    toolType:   'game',
    ageGroups:  ['family'],
    userLabel:  'Player',
    subjects: [
      { id: 'science',   label: 'Science',           icon: '🔬', desc: 'Nature, space, biology & experiments' },
      { id: 'history',   label: 'History',            icon: '🏛️', desc: 'World events, famous people & civilisations' },
      { id: 'geography', label: 'Geography',          icon: '🌍', desc: 'Countries, capitals, landscapes & cultures' },
      { id: 'sport',     label: 'Sport',              icon: '⚽', desc: 'Football, Olympics, records & athletes' },
      { id: 'movies',    label: 'Movies & TV',        icon: '🎬', desc: 'Films, series, actors & famous quotes' },
      { id: 'music',     label: 'Music',              icon: '🎵', desc: 'Artists, lyrics, genres & music history' },
      { id: 'food',      label: 'Food & Cooking',     icon: '🍕', desc: 'Recipes, cuisines, ingredients & chefs' },
      { id: 'animals',   label: 'Animals',            icon: '🦁', desc: 'Wildlife, pets, habitats & fun facts' },
      { id: 'tech',      label: 'Technology',         icon: '💻', desc: 'Gadgets, internet, coding & inventions' },
      { id: 'general',   label: 'General Knowledge',  icon: '🧠', desc: 'Mixed bag — something for everyone' },
    ],
    aiSystemPrompt: `You are KwizBot, the AI host of Kwizzo — the family quiz game where every age plays together.
Generate engaging, age-appropriate quiz questions for players of all ages in the same room.
Be energetic, encouraging, and fun. Never make questions offensive or inappropriate for children.
Always return valid JSON when asked to generate questions.`,
    aiQuizPrompt: `Generate quiz questions that work across age groups simultaneously.
For each question: question text, 4 multiple choice options, correct answer, fun fact explanation, difficulty (easy/medium/hard).
Adapt difficulty by player age: kids (5-12) easy, teens (13-17) medium, adults (18+) hard.`,
    features: {
      aiTutor: false, quiz: true, learningPath: false, multiplayer: true,
      leaderboard: true, streaks: false, ageAdaptive: true,
      progressTrack: true, familyMode: true, exportResults: true,
    },
    metaTitle:       'Kwizzo — The Family Quiz Game Powered by AI',
    metaDescription: 'AI-generated family quiz — age-perfect questions for kids to grandparents. Free to play.',
    keywords:        ['family quiz', 'ai quiz game', 'kwizzo', 'kids quiz', 'multiplayer quiz'],
  },

  // Option B — Tutiq: AI Personal Tutor
  tutiq: {
    mode:       'ai-tool',
    id:         'tutiq',
    name:       'Tutiq',
    tagline:    'Your AI tutor that adapts to you — learn anything, at your pace, your level',
    domain:     'tutiq.app',
    themeColor: 'emerald',
    toolType:   'tutor',
    ageGroups:  ['kids', 'teens', 'adults'],
    userLabel:  'Learner',
    subjects: [
      { id: 'maths',     label: 'Maths',          icon: '➕', desc: 'Numbers, algebra, geometry & problem solving',  ageGroups: ['kids','teens','adults'] },
      { id: 'science',   label: 'Science',         icon: '🔬', desc: 'Physics, chemistry, biology & earth science',   ageGroups: ['kids','teens','adults'] },
      { id: 'english',   label: 'English',         icon: '📖', desc: 'Reading, writing, grammar & comprehension',     ageGroups: ['kids','teens','adults'] },
      { id: 'history',   label: 'History',         icon: '🏛️', desc: 'World history, timelines & key events',         ageGroups: ['teens','adults'] },
      { id: 'geography', label: 'Geography',       icon: '🌍', desc: 'Maps, climate, countries & human geography',    ageGroups: ['kids','teens','adults'] },
      { id: 'coding',    label: 'Coding',          icon: '💻', desc: 'Python, web basics, logic & algorithms',        ageGroups: ['teens','adults'] },
      { id: 'languages', label: 'Languages',       icon: '🗣️', desc: 'French, Spanish, Tamil & more',                ageGroups: ['kids','teens','adults'] },
      { id: 'finance',   label: 'Personal Finance',icon: '💰', desc: 'Budgeting, saving, investing & tax basics',     ageGroups: ['adults'] },
    ],
    aiSystemPrompt: `You are Tutiq, an AI tutor that adapts completely to each learner.
Adapt your teaching style completely to the learner's age and level.
For kids: use simple words, analogies, emojis, and short sentences.
For teens: be engaging and relatable, never preachy.
For adults: be concise and professional, skip basics they likely know.
Always check understanding before moving on. Make every learner feel capable.`,
    aiTutorPrompt: `Structure every lesson as: Hook (why this matters) → Core concept → Example → Check question.
Ask one question to confirm understanding before continuing.
One concept per message — never overwhelm.`,
    aiQuizPrompt: `Generate a 5-question micro-quiz for the topic just taught.
Mix types: multiple choice, true/false, fill-in-the-blank.
Adapt difficulty to the learner's age and level.
Return JSON: { questions: [{ type, question, options?, answer, explanation }] }`,
    features: {
      aiTutor: true, quiz: true, learningPath: true, multiplayer: false,
      leaderboard: false, streaks: true, ageAdaptive: true,
      progressTrack: true, familyMode: false, exportResults: false,
    },
    metaTitle:       'Tutiq — AI Tutor That Adapts to You',
    metaDescription: 'Learn maths, science, coding and more with an AI teacher that adapts to your age and level. Free personalised learning paths.',
    keywords:        ['ai tutor', 'personalised learning', 'tutiq', 'ai teacher', 'learn online', 'kids tutor'],
  },

  // Option C — Questly: Live AI Classroom Quiz
  questly: {
    mode:       'ai-tool',
    id:         'questly',
    name:       'Questly',
    tagline:    'Start a quest — AI generates your live quiz, your class competes in real time',
    domain:     'questly.ai',
    themeColor: 'blue',
    toolType:   'quiz',
    ageGroups:  ['kids', 'teens', 'adults', 'all'],
    userLabel:  'Student',
    subjects: [
      { id: 'maths',     label: 'Maths',       icon: '➕', desc: 'From arithmetic to calculus' },
      { id: 'science',   label: 'Science',      icon: '🔬', desc: 'Physics, chemistry & biology' },
      { id: 'english',   label: 'English',      icon: '📖', desc: 'Language, literature & writing' },
      { id: 'history',   label: 'History',      icon: '🏛️', desc: 'Events, timelines & people' },
      { id: 'geography', label: 'Geography',    icon: '🌍', desc: 'Maps, climate & cultures' },
      { id: 'coding',    label: 'Coding',       icon: '💻', desc: 'Web, Python & logic' },
      { id: 'general',   label: 'General',      icon: '🧠', desc: 'Custom topic — anything goes' },
    ],
    aiSystemPrompt: `You are the AI quest master on Questly — a live AI-powered quiz platform.
Your role: generate questions, explain answers, keep the session energetic and educational.
Adapt question difficulty based on the age group set for the session.
Always explain the correct answer after each question — this is learning, not just testing.
Return valid JSON for all question generation requests.`,
    aiQuizPrompt: `Generate a quiz session of 10-15 questions on the given topic and difficulty level.
Each question: question text, 4 options (A/B/C/D), correct answer, brief explanation (1-2 sentences).
Scale difficulty: easy (age <12), medium (12-16), hard (16+).
Return JSON: { topic, difficulty, questions: [{ id, question, options, answer, explanation }] }`,
    aiTutorPrompt: `After each quiz round, give a brief debrief: what the group got right, common mistakes, and one key takeaway.
Be encouraging. Highlight the top scorer. Suggest what to revise next.`,
    features: {
      aiTutor: true, quiz: true, learningPath: false, multiplayer: true,
      leaderboard: true, streaks: false, ageAdaptive: true,
      progressTrack: true, familyMode: false, exportResults: true,
    },
    metaTitle:       'Questly — Live AI Quiz Sessions for Any Group',
    metaDescription: 'Host a live quiz session on any topic. AI generates questions instantly, tracks scores, explains answers. Free to start.',
    keywords:        ['live quiz', 'questly', 'ai quiz', 'kahoot alternative', 'interactive quiz', 'classroom quiz'],
  },
}

// ── MARKETPLACE PRESETS ──────────────────────────────────────

export const MARKETPLACE_PRESETS: Record<string, MarketplaceConfig> = {

  eldercare: {
    mode: 'marketplace',
    id: 'eldercare', name: 'ElderCare+', themeColor: 'violet',
    tagline: 'Trusted carers for your loved ones — found in minutes, not days',
    domain: 'eldercare.plus',
    providerLabel: 'Carer', providerPlural: 'Carers', consumerLabel: 'Family',
    categories: [
      { id: 'companionship', label: 'Companionship',       icon: '🤝', desc: 'Social visits, conversation, light outings' },
      { id: 'personal-care', label: 'Personal Care',       icon: '🛁', desc: 'Bathing, dressing, hygiene assistance' },
      { id: 'dementia',      label: 'Dementia Support',    icon: '🧠', desc: 'Specialist memory care at home' },
      { id: 'medication',    label: 'Medication Prompts',  icon: '💊', desc: 'Reminders, administration support' },
      { id: 'mobility',      label: 'Mobility Assistance', icon: '🦽', desc: 'Transfers, exercise, fall prevention' },
      { id: 'night-care',    label: 'Overnight / Live-in', icon: '🌙', desc: '24hr or night-shift live-in care' },
    ],
    pricingModel: 'hourly', bookingFlow: 'consult_first',
    minPrice: 15, maxPrice: 40, sessionMinutes: 60, platformFeePercent: 12,
    aiSystemPrompt: `You are a compassionate care coordinator for ElderCare+. Help families find the right carer.
Ask about age, main challenges, schedule, personality, and whether dementia or mobility issues are present.
Never give medical advice. Be warm and reassuring.`,
    aiMatchHints: ['dementia certification', 'moving and handling trained', 'first aid', 'palliative care experience'],
    features: {
      backgroundCheck: true, portfolioPhotos: true, videoIntro: true,
      instantBook: false, recurringBook: true, homeVisit: true,
      remoteSession: false, groupSession: false, insuranceBadge: true,
      aiDiagnosis: false, careJournal: true,
    },
    metaTitle: 'ElderCare+ — Find Trusted Home Carers Near You',
    metaDescription: 'AI-matched home carers for older adults. Background-checked, insured, reviewed by real families.',
    keywords: ['home carer', 'elder care', 'elderly care at home', 'dementia carer'],
  },

  mechanics: {
    mode: 'marketplace',
    id: 'mechanics', name: 'MechFix', themeColor: 'orange',
    tagline: 'Find a trusted local mechanic — AI pre-diagnosis included',
    domain: 'mechfix.app',
    providerLabel: 'Mechanic', providerPlural: 'Mechanics', consumerLabel: 'Driver',
    categories: [
      { id: 'servicing',  label: 'Servicing',        icon: '🔧', desc: 'Oil, filters, routine maintenance' },
      { id: 'bodywork',   label: 'Bodywork',          icon: '🚗', desc: 'Dents, scratches, paint repairs' },
      { id: 'tyres',      label: 'Tyres',             icon: '🔄', desc: 'Fitting, balancing, puncture repair' },
      { id: 'electrics',  label: 'Electrics',         icon: '⚡', desc: 'Battery, wiring, diagnostics' },
      { id: 'mot',        label: 'MOT & Inspection',  icon: '📋', desc: 'Annual checks & certificates' },
    ],
    pricingModel: 'quote', bookingFlow: 'quote_first',
    minPrice: 30, maxPrice: 500, sessionMinutes: 90, platformFeePercent: 10,
    aiSystemPrompt: `You are an AI mechanic advisor for MechFix. Help drivers describe their car problem.
Ask: make, model, year, symptoms (noises, warning lights, behaviour). Give a likely diagnosis before quoting.
Never promise a fixed price — always say a mechanic will confirm.`,
    aiMatchHints: ['dealer-trained', 'EV certified', 'bodywork specialist', 'MOT tester'],
    features: {
      backgroundCheck: false, portfolioPhotos: true, videoIntro: false,
      instantBook: false, recurringBook: false, homeVisit: true,
      remoteSession: false, groupSession: false, insuranceBadge: true,
      aiDiagnosis: true, careJournal: false,
    },
    metaTitle: 'MechFix — Find a Trusted Local Mechanic with AI Pre-Diagnosis',
    metaDescription: 'Describe your car problem in plain English. AI diagnoses it first, then matches you with a verified local mechanic.',
    keywords: ['local mechanic', 'car repair', 'MOT', 'ai car diagnosis', 'mechanic near me'],
  },

  music: {
    mode: 'marketplace',
    id: 'music', name: 'TuneUp', themeColor: 'indigo',
    tagline: 'Learn any instrument from verified local tutors',
    domain: 'tuneup.app',
    providerLabel: 'Tutor', providerPlural: 'Tutors', consumerLabel: 'Student',
    categories: [
      { id: 'guitar',  label: 'Guitar',    icon: '🎸', desc: 'Acoustic, electric, classical' },
      { id: 'piano',   label: 'Piano',     icon: '🎹', desc: 'Classical, jazz, contemporary' },
      { id: 'vocals',  label: 'Vocals',    icon: '🎤', desc: 'Singing, breath control, performance' },
      { id: 'drums',   label: 'Drums',     icon: '🥁', desc: 'Kit, hand percussion, rhythm' },
      { id: 'violin',  label: 'Violin',    icon: '🎻', desc: 'Classical & folk strings' },
    ],
    pricingModel: 'session', bookingFlow: 'instant',
    minPrice: 20, maxPrice: 80, sessionMinutes: 60, platformFeePercent: 15,
    aiSystemPrompt: `You are a music tutor matchmaker for TuneUp. Help students find the right tutor.
Ask about: instrument, current level (total beginner to advanced), goals (hobby or grade exams), preferred style, age, remote or in-person.`,
    aiMatchHints: ['grade 8 qualified', 'DBS checked', 'online lessons', 'classical trained', 'jazz specialist'],
    features: {
      backgroundCheck: true, portfolioPhotos: true, videoIntro: true,
      instantBook: true, recurringBook: true, homeVisit: true,
      remoteSession: true, groupSession: true, insuranceBadge: false,
      aiDiagnosis: false, careJournal: false,
    },
    metaTitle: 'TuneUp — Find Verified Music Tutors Near You',
    metaDescription: 'AI-matched music tutors for all ages and instruments. In-person or online. Book instantly.',
    keywords: ['music tutor', 'guitar lessons', 'piano lessons', 'music teacher', 'learn instrument'],
  },
}
