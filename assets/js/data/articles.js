/* Daily reading articles.
 * Add a new object to the top of the list each day. `body` is an array of blocks:
 *   'plain string'            → paragraph
 *   { quote: '…' }            → highlighted quote
 * `vocab` lists useful words with a short definition and an example from the article.
 */
window.IELTS_DATA = window.IELTS_DATA || {};
window.IELTS_DATA.articles = [
  {
    id: 'day-2-science-of-fatherhood',
    day: 2,
    title: 'The Science of Fatherhood',
    date: '2026-07-11',
    source: 'New Scientist',
    byline: 'Book review: Dad Brain by Darby Saxbe · Reviewed by Olivia Goldhill',
    topics: ['Psychology', 'Family'],
    body: [
      'Did you know that fathers with smaller testicles experience a stronger response in the brain when they look at pictures of their babies? Or that these men are also rated as more hands-on parents by their partners? These are among the many unexpected details woven into Darby Saxbe’s Dad Brain: The new science of fatherhood and how it shapes men’s lives.',
      'Saxbe is a psychologist at the University of Southern California who researches parenting, and acknowledges upfront that it might be odd for a woman to write a whole book on fathers. But then, she adds, that hasn’t stopped the many men who research and opine on women’s health.',
      'Saxbe has the expertise, and makes a strong case for understanding dads’ brains: a father’s level of engagement is closely correlated with the wellbeing of both partners and children. When parenting, the whole family needs to be understood and supported.',
      { quote: 'In the Republic of the Congo, Aka fathers spend much of their time holding and cuddling their infants, even while climbing trees and hunting. They are within arm’s reach of their children almost 50 per cent of the time — in contrast to the Kipsigis people in East Africa, where men believe a baby’s regurgitations and poo can harm their masculinity, and aren’t supposed to see their children in the first weeks after birth.' },
      'Globally, while mothers are often physically tied to their children through pregnancy and breastfeeding, fathers remain largely overlooked in scientific literature: a search for “mothers” returns 10 times more results than for “fathers”. Yet fathers are hugely important — toddlers wake up less often at night when fathers take part in bedtime routines.'
    ],
    vocab: [
      { word: 'hands-on', pos: 'adj', meaning: 'actively and practically involved', example: 'rated as more hands-on parents by their partners' },
      { word: 'upfront', pos: 'adv', meaning: 'openly, from the very beginning', example: 'acknowledges upfront that it might be odd' },
      { word: 'opine', pos: 'verb', meaning: 'to give your opinion (formal)', example: 'research and opine on women’s health' },
      { word: 'engagement', pos: 'noun', meaning: 'the act of being involved with something', example: 'a father’s level of engagement' },
      { word: 'correlated (with)', pos: 'adj', meaning: 'connected so that one changes with the other', example: 'closely correlated with the wellbeing of… children' },
      { word: 'overlooked', pos: 'adj', meaning: 'not noticed or given enough attention', example: 'fathers remain largely overlooked' }
    ],
    questions: [
      { q: 'Why does Saxbe think it is acceptable for a woman to write about fathers?', a: 'Because many men already research and give opinions on women’s health.' },
      { q: 'What is the link between fathers’ engagement and the family?', a: 'It is closely correlated with the wellbeing of both partners and children.' },
      { q: 'What evidence shows that fathers are under-researched?', a: 'A search for “mothers” returns ten times more results than for “fathers”.' }
    ]
  },
  {
    id: 'day-1-sleep-and-memory',
    day: 1,
    title: 'Why Sleep Is Your Best Study Tool',
    date: '2026-07-10',
    source: 'mrshakhriyor_ielts',
    byline: 'Original article for IELTS learners',
    topics: ['Health', 'Education'],
    body: [
      'Many students believe that the best way to prepare for an exam is to study late into the night. The evidence suggests the opposite. Sleep is not simply a pause between study sessions; it is an active process in which the brain sorts, strengthens and stores what it learned during the day.',
      'Researchers describe this process as memory consolidation. During deep sleep, the brain appears to replay recent experiences, moving information from short-term storage into more stable long-term networks. Students who sleep after learning new vocabulary, for example, tend to remember more of it the next day than those who stay awake for the same length of time.',
      { quote: 'Cutting sleep to gain an extra hour of study is rarely a good trade: the hour is gained, but much of what was learned in it may be lost.' },
      'Lack of sleep also affects attention and mood. A tired learner reads more slowly, misses details and finds it harder to stay calm under time pressure — exactly the skills an IELTS Reading test demands.',
      'The practical lesson is straightforward. Spread your study over several days, review difficult material shortly before bed, and protect a regular sleep schedule, especially in the week before your test.'
    ],
    vocab: [
      { word: 'consolidation', pos: 'noun', meaning: 'the process of making something stronger or more stable', example: 'memory consolidation' },
      { word: 'replay', pos: 'verb', meaning: 'to repeat something that has already happened', example: 'the brain appears to replay recent experiences' },
      { word: 'trade (n.)', pos: 'noun', meaning: 'an exchange of one thing for another', example: 'rarely a good trade' },
      { word: 'straightforward', pos: 'adj', meaning: 'easy to understand; simple', example: 'The practical lesson is straightforward.' }
    ],
    questions: [
      { q: 'What happens to information during deep sleep, according to the article?', a: 'It is moved from short-term storage into more stable long-term networks.' },
      { q: 'Name two effects of lack of sleep mentioned in the article.', a: 'Any two of: poorer attention, worse mood, slower reading, missing details, difficulty staying calm.' }
    ]
  }
];
