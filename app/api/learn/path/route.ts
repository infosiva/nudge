import { NextRequest, NextResponse } from 'next/server'
import { aiCached, aiChat } from '@/lib/ai'
import { AI_LIMITER } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

// ── Hardcoded GCSE / 11+ curricula — syllabus-locked, never AI-generated ─────
// AI teaches and quizzes each topic; the topic list itself is curriculum-accurate

type Topic = { id: string; title: string; desc: string }

const CURRICULA: Record<string, Topic[]> = {
  'maths-gcse': [
    { id: 'number-types',         title: 'Number Types & Place Value',    desc: 'Integers, decimals, fractions — the building blocks of all GCSE Maths.' },
    { id: 'fractions-decimals',   title: 'Fractions, Decimals & Percentages', desc: 'Converting between forms and solving percentage problems under exam pressure.' },
    { id: 'ratio-proportion',     title: 'Ratio & Proportion',            desc: 'Dividing quantities in a ratio and solving proportion problems.' },
    { id: 'algebra-basics',       title: 'Algebra: Expressions & Equations', desc: 'Simplifying, expanding, factorising and solving linear equations.' },
    { id: 'sequences',            title: 'Sequences & nth Term',          desc: 'Arithmetic and geometric sequences — finding rules and the nth term.' },
    { id: 'straight-line-graphs', title: 'Straight-Line Graphs (y=mx+c)', desc: 'Gradient, y-intercept, parallel and perpendicular lines.' },
    { id: 'quadratics',           title: 'Quadratics & Completing the Square', desc: 'Factorising, quadratic formula, completing the square, discriminant.' },
    { id: 'geometry-angles',      title: 'Angles & Geometry Properties',  desc: 'Angle rules, parallel lines, polygons and circle theorems.' },
    { id: 'pythagoras-trig',      title: 'Pythagoras & Trigonometry',     desc: 'SOHCAHTOA, Pythagoras, sine and cosine rules for GCSE.' },
    { id: 'area-volume',          title: 'Area, Surface Area & Volume',   desc: 'Calculating for 2D shapes and 3D solids including cones and spheres.' },
    { id: 'statistics-data',      title: 'Statistics: Averages & Charts', desc: 'Mean, median, mode, range, frequency tables, box plots, histograms.' },
    { id: 'probability',          title: 'Probability & Tree Diagrams',   desc: 'Simple probability, combined events, tree diagrams and Venn diagrams.' },
  ],

  'english-gcse': [
    { id: 'language-analysis',    title: 'Language Analysis (AO2)',       desc: 'Identifying and analysing language techniques: metaphor, imagery, tone, structure.' },
    { id: 'structure-analysis',   title: 'Structure Analysis',            desc: 'How writers use structural devices — openings, shifts, endings — for effect.' },
    { id: 'unseen-fiction',       title: 'Reading Unseen Fiction',        desc: 'Extracting information, summarising and analysing unseen literary texts.' },
    { id: 'unseen-nonfiction',    title: 'Reading Non-Fiction Texts',     desc: 'Comparing writers\' viewpoints, rhetoric and persuasive techniques.' },
    { id: 'descriptive-writing',  title: 'Descriptive & Narrative Writing', desc: 'Crafting vivid, structured creative writing with high-impact openings.' },
    { id: 'persuasive-writing',   title: 'Persuasive & Argumentative Writing', desc: 'Writing to argue, persuade or advise — rhetoric, counter-argument, structure.' },
    { id: 'poetry-anthology',     title: 'Poetry Anthology Themes',       desc: 'Comparing poems on power, conflict, identity — AQA/Edexcel anthology.' },
    { id: 'shakespeare',          title: 'Shakespeare Set Text',          desc: 'Character, theme and context analysis for your GCSE Shakespeare play.' },
    { id: 'modern-prose',         title: 'Modern Prose / Drama Text',     desc: 'Analysing character, theme and writer\'s craft in your 19th/20th century text.' },
    { id: 'spoken-language',      title: 'Spoken Language & Accent',      desc: 'How and why spoken language varies — dialect, register, context.' },
    { id: 'grammar-punctuation',  title: 'Grammar, Punctuation & Spelling', desc: 'SPaG skills examiners reward — apostrophes, commas, sentence variety.' },
  ],

  'science-gcse': [
    // Biology
    { id: 'cell-biology',         title: 'Cell Biology',                  desc: 'Cell structure, specialised cells, transport across membranes.' },
    { id: 'organisation',         title: 'Organisation & Organ Systems',  desc: 'Digestive, circulatory and respiratory systems — structure and function.' },
    { id: 'infection-response',   title: 'Infection & Response',          desc: 'Pathogens, immune response, vaccines and antibiotics.' },
    { id: 'bioenergetics',        title: 'Bioenergetics: Photosynthesis & Respiration', desc: 'Photosynthesis equation, factors, aerobic and anaerobic respiration.' },
    { id: 'inheritance',          title: 'Genetics & Inheritance',        desc: 'DNA, chromosomes, Mendel, Punnett squares and genetic disorders.' },
    // Chemistry
    { id: 'atomic-structure',     title: 'Atomic Structure & Periodic Table', desc: 'Atoms, isotopes, electronic configuration, groups and periods.' },
    { id: 'bonding',              title: 'Bonding & Structure',           desc: 'Ionic, covalent and metallic bonding — structures and properties.' },
    { id: 'quantitative-chem',    title: 'Quantitative Chemistry (Moles)', desc: 'Relative masses, moles, percentage yield and atom economy.' },
    { id: 'chemical-changes',     title: 'Chemical Changes & Electrolysis', desc: 'Reactivity series, acids and bases, electrolysis of solutions.' },
    // Physics
    { id: 'forces',               title: 'Forces & Motion',               desc: 'Speed, velocity, acceleration, Newton\'s laws, momentum.' },
    { id: 'energy',               title: 'Energy Stores & Transfers',     desc: 'Energy types, efficiency, specific heat capacity, conservation.' },
    { id: 'waves',                title: 'Waves: Light & Sound',          desc: 'Wave properties, reflection, refraction, EM spectrum uses.' },
    { id: 'electricity',          title: 'Electricity & Circuits',        desc: 'Current, voltage, resistance, series and parallel circuits, power.' },
  ],

  'history-gcse': [
    { id: 'medicine-time',        title: 'Medicine Through Time',         desc: 'From prehistoric to modern medicine — causes, treatments and turning points.' },
    { id: 'western-front',        title: 'The Western Front 1914–18',     desc: 'Conditions, key battles and medical developments in WW1.' },
    { id: 'weimar-germany',       title: 'Weimar & Nazi Germany 1918–39', desc: 'Rise of Hitler, Nazi methods of control and life under the Third Reich.' },
    { id: 'cold-war',             title: 'The Cold War 1945–91',          desc: 'Origins, key crises, arms race and the fall of the Berlin Wall.' },
    { id: 'elizabethan-england',  title: 'Elizabethan England 1568–1603', desc: 'Society, government, exploration and the Religious Settlement.' },
    { id: 'source-skills',        title: 'Source Analysis & Evaluation',  desc: 'How to analyse, evaluate and compare primary and secondary sources.' },
    { id: 'essay-technique',      title: 'GCSE History Essay Technique',  desc: 'How to structure 16-mark "how far do you agree" and 12-mark explain answers.' },
  ],

  'geography-gcse': [
    { id: 'tectonic-hazards',     title: 'Tectonic Hazards',              desc: 'Plate tectonics, earthquakes and volcanoes — causes, effects, responses.' },
    { id: 'weather-climate',      title: 'Weather Hazards & Climate',     desc: 'Tropical storms, UK weather, climate change causes and effects.' },
    { id: 'ecosystems',           title: 'Ecosystems & Biomes',           desc: 'Tropical rainforests, hot deserts — characteristics, causes, management.' },
    { id: 'urban-issues',         title: 'Urban Issues & Challenges',     desc: 'UK and global city growth, urbanisation, regeneration, sustainability.' },
    { id: 'changing-economic',    title: 'Changing Economic World',       desc: 'Development gap, LICs vs HICs, TNCs, trade and aid.' },
    { id: 'resource-management',  title: 'Resource Management',           desc: 'Food, water and energy security — global distribution and strategies.' },
    { id: 'fieldwork-skills',     title: 'Geographical Skills & Fieldwork', desc: 'Map skills, data presentation, statistical techniques and fieldwork methods.' },
    { id: 'coastal-landscapes',   title: 'Coastal Landscapes',            desc: 'Erosion, deposition, landforms and coastal management strategies.' },
    { id: 'river-landscapes',     title: 'River Landscapes & Flooding',   desc: 'River processes, landforms, flood management and case studies.' },
  ],

  'eleven-plus': [
    // Verbal Reasoning
    { id: 'vr-word-meanings',     title: 'Verbal Reasoning: Word Meanings', desc: 'Synonyms, antonyms, odd-one-out and word associations.' },
    { id: 'vr-analogies',         title: 'Verbal Reasoning: Analogies',   desc: 'Word relationships and completing verbal analogy patterns.' },
    { id: 'vr-sequences',         title: 'Verbal Reasoning: Letter & Word Sequences', desc: 'Completing letter sequences, codes and word patterns.' },
    { id: 'vr-cloze',             title: 'Verbal Reasoning: Cloze & Comprehension', desc: 'Fill-in-the-blank and reading comprehension passages.' },
    // Non-Verbal Reasoning
    { id: 'nvr-shapes',           title: 'Non-Verbal: Shape Patterns',    desc: 'Identifying the next shape in a visual sequence.' },
    { id: 'nvr-spatial',          title: 'Non-Verbal: Spatial Reasoning', desc: 'Rotating shapes, nets, reflections and 3D visualisation.' },
    { id: 'nvr-matrices',         title: 'Non-Verbal: Matrices & Grids',  desc: 'Completing 3×3 grids and matrix pattern recognition.' },
    // Maths
    { id: '11plus-number',        title: '11+ Maths: Number & Operations', desc: 'Mental arithmetic, fractions, decimals and percentages under time pressure.' },
    { id: '11plus-algebra',       title: '11+ Maths: Algebra & Sequences', desc: 'Simple algebra, number patterns and function machines.' },
    { id: '11plus-geometry',      title: '11+ Maths: Shapes & Geometry',  desc: 'Area, perimeter, angles and 2D/3D shape properties.' },
    { id: '11plus-data',          title: '11+ Maths: Data Handling',      desc: 'Charts, tables, averages and probability.' },
    // English
    { id: '11plus-comprehension', title: '11+ English: Comprehension',    desc: 'Answering comprehension questions on unseen passages accurately.' },
    { id: '11plus-writing',       title: '11+ English: Creative Writing', desc: 'Planning and writing a structured, imaginative story or description.' },
  ],

  // Interview subjects — dynamic AI paths (niche, no fixed syllabus)
  'interview-tech':  [],
  'interview-gen':   [],
  'interview-nurse': [],
  'interview-law':   [],
}

export async function POST(req: NextRequest) {
  const limited = AI_LIMITER.check(req)
  if (limited) return limited

  try {
    const { subject, level, goal, age } = await req.json()
    if (!subject || !level) {
      return NextResponse.json({ error: 'subject and level required' }, { status: 400 })
    }

    // Curriculum-locked subjects — return immediately, no AI call
    const fixed = CURRICULA[subject]
    if (fixed && fixed.length > 0) {
      return NextResponse.json({ topics: fixed })
    }

    // Dynamic subjects (interview, unknown) — generate via AI
    const cacheKey = `learn_path_v3_${subject}_${level}_${age}`

    const raw = await aiCached(cacheKey, () =>
      aiChat(
        [
          {
            role: 'user',
            content: `Generate a learning path for a ${age}-year-old studying "${subject}" at "${level}" level.
${goal ? `Their goal: ${goal}` : ''}

Return ONLY a JSON object (no markdown):
{
  "topics": [
    { "id": "topic-slug", "title": "Topic Title", "desc": "One sentence description." }
  ]
}

Rules:
- 8–12 topics, ordered fundamentals to advanced
- id: lowercase, hyphen-separated, unique
- desc: one engaging sentence
- No markdown, no explanation, just JSON`,
          },
        ],
        'You are a curriculum designer. Output only valid JSON, no markdown fences.'
      ))

    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(cleaned)
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('/api/learn/path error:', err)
    return NextResponse.json({ error: 'Failed to generate learning path' }, { status: 500 })
  }
}
