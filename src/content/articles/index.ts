export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'tip'; text: string }
  | { type: 'table'; head: string[]; rows: string[][] }

export interface Article {
  slug: string
  title: string
  summary: string
  category: 'Test day' | 'Reading' | 'Writing' | 'Daily reading'
  minutes: number
  date: string
  source?: string
  /** Suggested next step, e.g. a test to practise the skill. */
  practice?: { label: string; to: string }
  blocks: Block[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'computer-delivered-test-day',
    title: 'What to expect on computer-delivered IELTS test day',
    summary: 'The order of the sections, what the screen looks like, and the small differences from the paper test that catch people out.',
    category: 'Test day',
    minutes: 5,
    date: '2026-09-20',
    practice: { label: 'Sit Full Mock Test 1', to: '/tests/mock-1' },
    blocks: [
      {
        type: 'p',
        text: 'In the computer-delivered test you take **Listening, Reading and Writing on a computer**, one after another, with no break between them. The **Speaking test is face to face** with an examiner, either on the same day or on a different day close to it.',
      },
      { type: 'h2', text: 'The order and the timing' },
      {
        type: 'table',
        head: ['Section', 'Time', 'What you do'],
        rows: [
          ['Listening', 'about 30 minutes', '4 parts, 40 questions, each recording heard once'],
          ['Reading', '60 minutes', '3 passages, 40 questions'],
          ['Writing', '60 minutes', 'Task 1 (150+ words) and Task 2 (250+ words)'],
          ['Speaking', '11–14 minutes', 'Interview, two-minute talk, discussion'],
        ],
      },
      {
        type: 'p',
        text: 'One difference matters a lot: on paper you get 10 minutes at the end of Listening to copy your answers onto the answer sheet. **On the computer you type your answers directly, so you only get 2 minutes at the end to check them.** Get used to answering as you listen.',
      },
      { type: 'h2', text: 'What the screen looks like' },
      {
        type: 'ul',
        items: [
          'The clock is at the top of the screen. You get warnings when 10 and 5 minutes remain.',
          'In Reading, the passage is on the left and the questions are on the right.',
          'Question numbers run along the bottom. You can jump to any question and flag one to come back to.',
          'You can highlight words and add notes — useful for marking key words in the questions.',
          'Some tasks use drag and drop, for example matching headings to paragraphs.',
          'You can change the text size and the colours if that makes reading easier.',
        ],
      },
      { type: 'h2', text: 'Typing your essays' },
      {
        type: 'p',
        text: 'The word count is shown as you type, so there is no need to count words. You can copy, cut and paste within your answer, but **there is no spell-check** — every spelling mistake is yours. If you type slowly, practise now: 250 words in 40 minutes needs a comfortable typing speed.',
      },
      {
        type: 'tip',
        text: 'Never leave an answer blank. There is no penalty for a wrong answer, so a sensible guess can only help your score.',
      },
      { type: 'h2', text: 'The night before' },
      {
        type: 'ol',
        items: [
          'Check the time and address of your test centre, and what ID you need to bring.',
          'Sit one full mock under exam conditions during the week before — not the night before.',
          'Sleep. Your listening concentration depends on it more than on any last-minute practice.',
        ],
      },
    ],
  },
  {
    slug: 'true-false-not-given',
    title: 'True, False or Not Given? A three-step method',
    summary: 'Why "Not Given" costs so many marks, and a simple routine that stops you from guessing.',
    category: 'Reading',
    minutes: 6,
    date: '2026-09-12',
    practice: { label: 'Practise with a 20-minute passage', to: '/tests/practice-whale' },
    blocks: [
      {
        type: 'p',
        text: 'True/False/Not Given questions test whether you can tell the difference between what a text **says**, what it **contradicts**, and what it **simply does not mention**. Most mistakes come from answering with your own knowledge or from missing one small word in the statement.',
      },
      { type: 'h2', text: 'The three answers' },
      {
        type: 'table',
        head: ['Answer', 'Choose it when…'],
        rows: [
          ['TRUE', 'the passage says the same thing, usually in different words'],
          ['FALSE', 'the passage says the opposite, or something that cannot be true at the same time'],
          ['NOT GIVEN', 'the passage says nothing about it — or talks about the topic without answering the exact point'],
        ],
      },
      { type: 'h2', text: 'Step 1 — find the small words that matter' },
      {
        type: 'p',
        text: 'Before you look at the passage, highlight the key words in the statement **and its qualifiers**: all, only, most, first, never, usually, more than, before. A statement is often false or not given because of a single qualifier.',
      },
      { type: 'h2', text: 'Step 2 — locate the idea' },
      {
        type: 'p',
        text: 'The questions follow the order of the passage. Scan for names, numbers and dates first, then for synonyms of the key words — the passage will rarely use the same words as the question.',
      },
      { type: 'h2', text: 'Step 3 — compare the meaning, not the words' },
      {
        type: 'p',
        text: 'Read the sentence before and after the place you found. Then ask: does the passage agree, disagree, or not say? If you find yourself thinking "it is probably true", the answer is almost certainly NOT GIVEN.',
      },
      { type: 'h2', text: 'Try it' },
      {
        type: 'quote',
        text: 'The museum opened in 1998 with a collection of two hundred paintings. Today it holds more than two thousand works, most of them donated by local families.',
      },
      {
        type: 'ul',
        items: [
          '**The museum opened in the late 1990s.** → TRUE (1998 is the late 1990s).',
          '**The museum has always held more than a thousand works.** → FALSE (it started with two hundred).',
          '**Most visitors to the museum are local families.** → NOT GIVEN (the families donated works; nothing is said about visitors).',
        ],
      },
      {
        type: 'tip',
        text: 'Yes/No/Not Given works in exactly the same way, but it asks about the writer’s opinions and claims rather than facts.',
      },
    ],
  },
  {
    slug: 'writing-task-1-overview',
    title: 'Writing Task 1: how to write an overview',
    summary: 'The one sentence that decides whether your Task 1 can score above band 5 — and how to write it in two minutes.',
    category: 'Writing',
    minutes: 5,
    date: '2026-09-05',
    practice: { label: 'Write Task 1 under exam conditions', to: '/tests/mock-1' },
    blocks: [
      {
        type: 'p',
        text: 'An **overview** is one or two sentences that summarise the main features of a chart, table or diagram — the big picture, without the small numbers. Examiners look for it first. Without a clear overview it is very hard to score above band 5 for Task Achievement, however accurate your details are.',
      },
      { type: 'h2', text: 'What goes into an overview' },
      {
        type: 'ul',
        items: [
          'The overall direction: did things rise, fall, or stay stable?',
          'The biggest and smallest categories, or the most important change.',
          'For a process or diagram: the number of stages, and where it starts and ends.',
        ],
      },
      { type: 'h2', text: 'An example' },
      {
        type: 'p',
        text: 'Imagine a line graph showing the number of visitors to three museums from 2010 to 2020. A strong overview could be:',
      },
      {
        type: 'quote',
        text: 'Overall, visitor numbers rose at the science museum and the art gallery but fell at the history museum, and by 2020 the science museum had become by far the most popular of the three.',
      },
      {
        type: 'p',
        text: 'Notice that there is not a single number in it. The numbers belong in your body paragraphs, where you support the overview with key figures.',
      },
      { type: 'h2', text: 'Useful ways to begin' },
      { type: 'ul', items: ['Overall, …', 'It is clear that …', 'The most striking feature of the graph is …', 'In general, …'] },
      { type: 'h2', text: 'Common mistakes' },
      {
        type: 'ol',
        items: [
          'Filling the overview with numbers — it then becomes a detail sentence.',
          'Calling it a conclusion and giving an opinion. Task 1 never asks what you think.',
          'Leaving it out because you ran out of time. Write it straight after your introduction.',
        ],
      },
      { type: 'tip', text: 'Spend the first two minutes of Task 1 finding two or three main features. Those become your overview.' },
    ],
  },
  {
    slug: 'science-of-fatherhood',
    title: 'The Science of Fatherhood',
    summary: 'Daily reading: a book review of Dad Brain by Darby Saxbe. Read it in five minutes, then check the vocabulary.',
    category: 'Daily reading',
    minutes: 4,
    date: '2026-07-11',
    source: 'Excerpt from a New Scientist book review (11 July 2026) of *Dad Brain: The new science of fatherhood and how it shapes men’s lives* by Darby Saxbe, reviewed by Olivia Goldhill.',
    blocks: [
      {
        type: 'p',
        text: 'Did you know that fathers with smaller testicles experience a stronger response in the brain when they look at pictures of their babies? Or that these men are also rated as more hands-on parents by their partners? These are among the many unexpected details woven into Darby Saxbe’s *Dad Brain: The new science of fatherhood and how it shapes men’s lives*.',
      },
      {
        type: 'p',
        text: 'Saxbe is a psychologist at the University of Southern California who researches parenting, and acknowledges upfront that it might be odd for a woman to write a whole book on fathers. But then, she adds, that hasn’t stopped the many men who research and opine on women’s health.',
      },
      {
        type: 'p',
        text: 'Saxbe has the expertise, and makes a strong case for understanding dads’ brains: a father’s level of engagement is closely correlated with the wellbeing of both partners and children. When parenting, the whole family needs to be understood and supported.',
      },
      {
        type: 'quote',
        text: 'In the Republic of the Congo, Aka fathers spend much of their time holding and cuddling their infants, even while climbing trees and hunting. They are within arm’s reach of their children almost 50 per cent of the time — in contrast to the Kipsigis people in East Africa, where men believe a baby’s regurgitations and poo can harm their masculinity, and aren’t supposed to see their children in the first weeks after birth.',
      },
      {
        type: 'p',
        text: 'Globally, while mothers are often physically tied through pregnancy and breastfeeding, fathers remain largely overlooked in scientific literature: a search for “mothers” returns 10 times more results than for “fathers”. Yet fathers are hugely important — toddlers wake up less often at night when fathers take part in bedtime routines.',
      },
      { type: 'h2', text: 'Vocabulary' },
      {
        type: 'table',
        head: ['Word', 'Meaning in the text'],
        rows: [
          ['hands-on (adj.)', 'actively involved in doing something'],
          ['opine (v.)', 'to give an opinion, often without being asked'],
          ['correlated with (adj.)', 'connected with — when one changes, the other changes too'],
          ['overlooked (adj.)', 'not noticed or not given enough attention'],
          ['engagement (n.)', 'how involved and active someone is'],
        ],
      },
    ],
  },
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}
