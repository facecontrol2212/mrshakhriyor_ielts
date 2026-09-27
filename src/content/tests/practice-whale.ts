import type { TestDef } from '@/types/content'

/** Single-passage practice set, migrated from the original prototype page. */
export const practiceWhale: TestDef = {
  id: 'practice-whale',
  title: 'The Whale Goes to Court',
  module: 'academic',
  kind: 'practice',
  difficulty: 'foundation',
  summary: 'One Academic passage with 13 questions — the right size for a focused 20-minute session.',
  topics: ['History of science', 'Law'],
  reading: {
    durationMinutes: 20,
    parts: [
      {
        id: 'w1',
        intro: 'You should spend about 20 minutes on **Questions 1–13**, which are based on the passage below.',
        passage: {
          title: 'The Whale Goes to Court',
          subtitle: 'A remarkable legal drama in the U.S.A.',
          paragraphs: [
            {
              text: 'In 1818, a whale became the subject of a controversial court case in New York City. The case involved an old law requiring those who sold fish oil to pay a fee in order to have their barrels inspected by city officials and certified. However, an oil merchant named Samuel Judd refused to pay the inspection fee on three barrels of oil, claiming that no inspection was necessary because it was whale oil, and whales were not fish. The state disagreed, and so a date was set for a court to decide not a point of law, but the answer to a more fundamental question: Is a whale a fish?',
            },
            {
              text: 'As simple as that question may appear today, the answer was far from obvious in the early nineteenth century. Indeed, the public debate in New York sparked off by the trial was sensational. At stake was nothing less than what most regarded as the order of nature. According to the commonly accepted scheme of things, if an animal was not a beast or a bird, it was a fish, regardless of whether it breathed air or suckled its young. For as long as anyone could remember, all non-human creatures had been organized according to the categories of birds, beasts, or fish. For the average person, the answer seemed perfectly obvious: whales swam in the sea and therefore they were fish.',
            },
            {
              text: 'Against this traditional framework stood the new Linnaean system of classification, which sought to introduce more scientific values into the classification of living things. Barely half a century old in 1818, the Linnaean system controversially classified whales as mammals because they shared two mammalian characteristics: they were warm-blooded and breathed air.',
            },
            {
              text: 'So the trial began in December 1818. Judd\'s defense lawyers chose as their star witness one of New York\'s most prominent figures, the congressman Samuel Mitchill. Referred to as a "living encyclopedia" and a "walking library", Mitchill was a renowned natural history lecturer at the College of Physicians and Surgeons who liked to dare his students to test his knowledge of the natural world. "Show me the fin, and I will name the fish," he boasted. Scientifically, it was an open-and-shut case, and Judd\'s defense lawyers believed they had only one simple thing to do to win the trial: insist that it be decided by biology alone. Mitchill seemed fully qualified for this role.',
            },
            {
              text: 'But this is where the case becomes interesting, and is the reason why the trial of the whale is not some dusty nineteenth-century obscurity. For rather than debate Mitchill on his area of expertise, lawyers for the New York City fish-oil inspectors chose a different tack. Lead counsel William Sampson turned the trial into a contest between scientific learning and common sense, by asking plain-spoken whalers to make their case before the jury.',
            },
            {
              text: "The crux of Sampson's case was the trial's implication with regard to humans: should Judd be found not guilty? Sampson told jury members that if they accepted Mitchill's testimony on whales, they were obliged to accept a lower place for their own kind in the natural order. As a result, Mitchill's day in court did not go smoothly, not least because he was forced to acknowledge disputes among biologists. Sampson then took aim at Mitchill himself and what he represented: privileged aristocrats from the scientific community who had lost touch with reality. The smooth-talking Sampson claimed Mitchill's beliefs had their origin in Europe — something he rightly judged would infuriate the citizens of always-independent New York. This revolutionary new thinking, Sampson claimed, was something that honest working New Yorkers could do without. No longer was this a case about barrels of oil, but about the proper place of scientific knowledge in the U.S.A. Ultimately, what won the case for Samuel Judd were not Mitchill's scientific arguments, but testimony from a different sphere altogether.",
            },
            {
              text: "In New York's markets, the merchants implicitly understood that whale oil and fish oil were not the same: whale oil could be used as a fuel for lamps because it could be burned without giving off smoke; fish oil, on the other hand, was nasty, impure stuff used primarily in tanning leather. In the end, it was this that led to Judd's victory.",
            },
            {
              text: "The trial of the whale still has relevance today, when the court of public opinion remains easily swayed by skeptics. The trial of the whale raises a question that is still with us: who gets to decide on the place of scientific expertise or public opinion? Whether the issue today is the effects of human activity on the climate of this planet, or one of many other contemporary topics, the legacy of Judd's case continues to be of relevance.",
            },
          ],
        },
        groups: [
          {
            id: 'w1-g1',
            type: 'tfng',
            from: 1,
            to: 7,
            instructions: [
              'Do the following statements agree with the information given in the passage?',
              'Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, or **NOT GIVEN** if there is no information on this.',
            ],
            questions: [
              { n: 1, text: 'An inspection fee for fish oil was introduced in New York in 1818.' },
              { n: 2, text: 'Samuel Judd argued that the inspection fee should exclude whale oil.' },
              { n: 3, text: 'Judd had been in trouble with city officials before the inspection fee disagreement.' },
              { n: 4, text: 'Many New Yorkers were interested in the court case at the time.' },
              { n: 5, text: 'Traditionally, non-human creatures had been classified in one of three groups.' },
              { n: 6, text: 'Generally speaking, ordinary people thought fish were the lowest form of life.' },
              { n: 7, text: 'Whales were excluded from the Linnaean system in 1818.' },
            ],
          },
          {
            id: 'w1-g2',
            type: 'gap',
            layout: 'sentences',
            from: 8,
            to: 13,
            wordLimit: { words: 1 },
            instructions: ['Complete the sentences below.', 'Choose **ONE WORD ONLY** from the passage for each answer.'],
            lines: [
              'Samuel Mitchill worked as a congressman and a {{8}}.',
              'William Sampson called {{9}} as witnesses to appeal to the common sense of the jury.',
              'Sampson suggested that Mitchill\'s ideas were unwelcome because they came from {{10}}.',
              "In the end, it was statements from local {{11}}, not Mitchill's testimony, which helped Judd win.",
              'Whale oil made a good {{12}} because it did not produce smoke.',
              "Judd's case is relevant today, for example in the debate about the Earth's {{13}}.",
            ],
          },
        ],
      },
    ],
    answers: {
      1: {
        accept: ['FALSE'],
        evidence: 'The case involved an old law requiring those who sold fish oil to pay a fee',
        explanation: 'The fee came from an old law — it was not introduced in 1818.',
      },
      2: {
        accept: ['TRUE'],
        evidence: 'claiming that no inspection was necessary because it was whale oil, and whales were not fish',
      },
      3: {
        accept: ['NOT GIVEN'],
        evidence: 'an oil merchant named Samuel Judd refused to pay the inspection fee',
        explanation: "Nothing is said about Judd's history with officials.",
      },
      4: { accept: ['TRUE'], evidence: 'the public debate in New York sparked off by the trial was sensational' },
      5: {
        accept: ['TRUE'],
        evidence: 'all non-human creatures had been organized according to the categories of birds, beasts, or fish',
      },
      6: {
        accept: ['NOT GIVEN'],
        evidence: 'if an animal was not a beast or a bird, it was a fish',
        explanation: 'The passage describes categories, not a ranking of which form of life was lowest.',
      },
      7: {
        accept: ['FALSE'],
        evidence: 'the Linnaean system controversially classified whales as mammals',
        explanation: 'Whales were included — as mammals.',
      },
      8: { accept: ['lecturer'], evidence: 'a renowned natural history lecturer' },
      9: { accept: ['whalers'], evidence: 'by asking plain-spoken whalers to make their case before the jury' },
      10: { accept: ['Europe'], evidence: "Mitchill's beliefs had their origin in Europe" },
      11: {
        accept: ['merchants'],
        evidence: "In New York's markets, the merchants implicitly understood that whale oil and fish oil were not the same",
      },
      12: { accept: ['fuel'], evidence: 'whale oil could be used as a fuel for lamps' },
      13: { accept: ['climate'], evidence: 'the effects of human activity on the climate of this planet' },
    },
  },
}
