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

  'biology-gcse': [
    { id: 'cell-structure',       title: 'Cell Structure & Organisation',      desc: 'Prokaryotic vs eukaryotic cells, organelles, specialised cells and stem cells.' },
    { id: 'cell-transport',       title: 'Cell Transport',                     desc: 'Diffusion, osmosis and active transport — with required practicals.' },
    { id: 'organisation',         title: 'Organisation & Organ Systems',       desc: 'Digestive enzymes, circulatory system structure and function, lungs.' },
    { id: 'infection-response',   title: 'Infection & Response',               desc: 'Pathogens, immune system, vaccines, antibiotics and drug discovery.' },
    { id: 'bioenergetics',        title: 'Bioenergetics',                      desc: 'Photosynthesis and respiration equations, factors affecting rate.' },
    { id: 'homeostasis',          title: 'Homeostasis & Response',             desc: 'Nervous system, hormones, blood glucose, menstrual cycle, diabetes.' },
    { id: 'reproduction',         title: 'Reproduction & Variation',           desc: 'Sexual vs asexual reproduction, mitosis, meiosis and DNA structure.' },
    { id: 'genetics-inheritance', title: 'Genetics & Inheritance',             desc: 'Mendel, Punnett squares, dominant/recessive, genetic disorders, evolution.' },
    { id: 'ecology',              title: 'Ecology & Ecosystems',               desc: 'Food webs, biotic/abiotic factors, carbon cycle, biodiversity, climate change.' },
    { id: 'required-practicals',  title: 'Required Practicals (Biology)',      desc: 'Osmosis, enzyme rates, culturing bacteria — method and analysis.' },
  ],

  'chemistry-gcse': [
    { id: 'atomic-structure',     title: 'Atomic Structure & Periodic Table',  desc: 'Protons, neutrons, electrons, isotopes, electronic configuration, groups & periods.' },
    { id: 'bonding-structure',    title: 'Bonding, Structure & Properties',    desc: 'Ionic, covalent, metallic bonding — structures, dot-cross diagrams, properties.' },
    { id: 'quantitative',         title: 'Quantitative Chemistry (Moles)',     desc: 'Relative masses, moles, concentration, percentage yield, atom economy.' },
    { id: 'chemical-changes',     title: 'Chemical Changes',                   desc: 'Reactivity series, displacement, acids & bases, electrolysis.' },
    { id: 'energy-changes',       title: 'Energy Changes',                     desc: 'Exothermic vs endothermic, reaction profiles, bond energies, Hess\'s law.' },
    { id: 'rate-equilibrium',     title: 'Rate of Reaction & Equilibrium',     desc: 'Collision theory, factors affecting rate, reversible reactions, Le Chatelier.' },
    { id: 'organic-chemistry',    title: 'Organic Chemistry',                  desc: 'Hydrocarbons, alkanes, alkenes, polymers, cracking, addition reactions.' },
    { id: 'chemical-analysis',    title: 'Chemical Analysis',                  desc: 'Pure substances, mixtures, chromatography, flame tests, gas tests.' },
    { id: 'atmosphere-resources', title: 'Atmosphere, Earth & Resources',      desc: 'Composition of air, climate change, water treatment, life cycle assessment.' },
    { id: 'required-practicals',  title: 'Required Practicals (Chemistry)',    desc: 'Titration, electrolysis, temperature & rate — method, results, analysis.' },
  ],

  'physics-gcse': [
    { id: 'energy-stores',        title: 'Energy Stores & Transfers',          desc: 'Energy types, conservation, efficiency, specific heat capacity, insulation.' },
    { id: 'electricity',          title: 'Electricity & Circuits',             desc: 'Current, voltage, resistance, series/parallel, power, mains electricity.' },
    { id: 'particle-model',       title: 'Particle Model of Matter',           desc: 'States of matter, changes of state, specific latent heat, gas pressure.' },
    { id: 'atomic-nuclear',       title: 'Atomic & Nuclear Physics',           desc: 'Atomic model history, radioactive decay, nuclear equations, half-life, uses.' },
    { id: 'forces',               title: 'Forces & Newton\'s Laws',            desc: 'Contact & non-contact forces, Newton\'s laws, weight, momentum, stopping distance.' },
    { id: 'motion',               title: 'Motion & Speed-Time Graphs',         desc: 'Distance-time, speed-time graphs, acceleration, equations of motion.' },
    { id: 'waves',                title: 'Waves: Properties & Uses',           desc: 'Transverse/longitudinal, reflection, refraction, EM spectrum applications.' },
    { id: 'magnetism-em',         title: 'Magnetism & Electromagnetism',       desc: 'Magnetic fields, motor effect, generators, transformers, induction.' },
    { id: 'space-physics',        title: 'Space Physics',                      desc: 'Solar system, life cycle of stars, Big Bang, red-shift evidence. (Triple only)' },
    { id: 'required-practicals',  title: 'Required Practicals (Physics)',      desc: 'Resistance, specific heat, waves — method, graphs and analysis.' },
  ],

  'cs-gcse': [
    { id: 'systems-architecture', title: 'Systems Architecture (CPU)',         desc: 'Von Neumann model, fetch-decode-execute cycle, CPU components, performance.' },
    { id: 'memory-storage',       title: 'Memory, Storage & Data',             desc: 'RAM vs ROM, primary/secondary storage, units, binary, hex, data types.' },
    { id: 'networks',             title: 'Computer Networks',                  desc: 'LAN/WAN, topologies, protocols (TCP/IP, HTTP), hardware, internet structure.' },
    { id: 'network-security',     title: 'Network Security & Cyber Threats',   desc: 'Malware types, social engineering, network security measures and policies.' },
    { id: 'system-software',      title: 'System Software & OS',               desc: 'Operating system roles, utility software, translators (compiler vs interpreter).' },
    { id: 'ethical-legal',        title: 'Ethical, Legal & Environmental',     desc: 'Privacy, legislation (Computer Misuse Act, GDPR), sustainability.' },
    { id: 'algorithms',           title: 'Algorithms & Problem Solving',       desc: 'Pseudocode, flowcharts, searching (linear/binary), sorting (bubble/merge).' },
    { id: 'programming-python',   title: 'Programming in Python',              desc: 'Variables, selection, iteration, functions, lists, file handling, OOP basics.' },
    { id: 'data-structures',      title: 'Data Structures',                    desc: 'Arrays, records, stacks, queues, linked lists, trees, SQL basics.' },
    { id: 'boolean-logic',        title: 'Boolean Logic & Logic Gates',        desc: 'AND, OR, NOT, truth tables, logic circuits, simplification.' },
  ],

  'french-gcse': [
    { id: 'identity-culture',     title: 'Identity, Family & Culture',         desc: 'Describing yourself, family relationships, cultural identity and daily life.' },
    { id: 'local-national',       title: 'Local, National & Global',           desc: 'Town, region, France and French-speaking world — geography and culture.' },
    { id: 'school',               title: 'School Life & Education',            desc: 'School system, subjects, routine, rules and future plans.' },
    { id: 'future-plans',         title: 'Future Plans & Work',                desc: 'Career aspirations, jobs, work experience, higher education.' },
    { id: 'health-lifestyle',     title: 'Health & Lifestyle',                 desc: 'Food, sport, wellbeing, healthy living and medical situations.' },
    { id: 'environment',          title: 'Environment & Social Issues',        desc: 'Environmental problems, global issues, news, social media.' },
    { id: 'grammar-tenses',       title: 'French Grammar: Tenses',             desc: 'Present, perfect, imperfect, future, conditional — formation and use.' },
    { id: 'grammar-verbs',        title: 'French Grammar: Verbs & Agreement',  desc: 'Regular/irregular verbs, reflexives, object pronouns, adjective agreement.' },
    { id: 'reading-skills',       title: 'Reading Comprehension Skills',       desc: 'Strategies for AQA/Edexcel reading papers — inference and detail.' },
    { id: 'writing-skills',       title: 'Writing & Translation Skills',       desc: 'Structured writing tasks, essay paragraphs, translation techniques.' },
  ],

  'spanish-gcse': [
    { id: 'identity-culture',     title: 'Identity, Family & Culture',         desc: 'Self-description, family, friendships and Spanish-speaking cultures.' },
    { id: 'local-national',       title: 'Local, National & Global Areas',     desc: 'Town, region, Spain and Latin America — comparing places and cultures.' },
    { id: 'school',               title: 'School Life & Education',            desc: 'School system, uniform, subjects, timetable and opinions.' },
    { id: 'future-plans',         title: 'Future Plans & Work',                desc: 'Career aspirations, part-time work, gap year, university.' },
    { id: 'health-lifestyle',     title: 'Health, Sport & Lifestyle',          desc: 'Food, exercise, wellbeing, illness and healthy habits.' },
    { id: 'environment',          title: 'Environment & Global Issues',        desc: 'Sustainability, climate change, social problems and volunteering.' },
    { id: 'grammar-tenses',       title: 'Spanish Grammar: Tenses',            desc: 'Present, preterite, imperfect, future, conditional — when and how to use them.' },
    { id: 'grammar-verbs',        title: 'Spanish Grammar: Key Verbs & Structures', desc: 'Ser/estar, irregular verbs, reflexives, gustar-type verbs, por/para.' },
    { id: 'reading-skills',       title: 'Reading Comprehension Skills',       desc: 'Strategies for AQA/Edexcel reading papers — gist and detail.' },
    { id: 'writing-skills',       title: 'Writing & Translation Skills',       desc: 'Photo tasks, essay writing, translation — accuracy and range.' },
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
