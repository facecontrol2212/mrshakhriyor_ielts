/* Reading tests.
 *
 * To add a test, append an object to the list below. Supported question-group types:
 *   tfng     — TRUE / FALSE / NOT GIVEN
 *   ynng     — YES / NO / NOT GIVEN
 *   choice   — pick one option; give `options` as [{value, label}] (used for MCQ and paragraph matching)
 *   gap      — type the answer; `answer` may be a string or an array of accepted alternatives
 * Questions are numbered automatically in the order they appear.
 */
window.IELTS_DATA = window.IELTS_DATA || {};
window.IELTS_DATA.readingTests = [
  {
    id: 'whale-goes-to-court',
    title: 'The Whale Goes to Court',
    subtitle: 'A remarkable legal drama in the U.S.A.',
    level: 'Passage 1',
    minutes: 20,
    topics: ['History', 'Science', 'Law'],
    paragraphs: [
      'In 1818, a whale became the subject of a controversial court case in New York City. The case involved an old law requiring those who sold fish oil to pay a fee in order to have their barrels inspected by city officials and certified. However, an oil merchant named Samuel Judd refused to pay the inspection fee on three barrels of oil, claiming that no inspection was necessary because it was whale oil, and whales were not fish. The state disagreed, and so a date was set for a court to decide not a point of law, but the answer to a more fundamental question: Is a whale a fish?',
      'As simple as that question may appear today, the answer was far from obvious in the early nineteenth century. Indeed, the public debate in New York sparked off by the trial was sensational. At stake was nothing less than what most regarded as the order of nature. According to the commonly accepted scheme of things, if an animal was not a beast or a bird, it was a fish, regardless of whether it breathed air or suckled its young. For as long as anyone could remember, all non-human creatures had been organized according to the categories of birds, beasts, or fish. For the average person, the answer seemed perfectly obvious: whales swam in the sea and therefore they were fish.',
      'Against this traditional framework stood the new Linnaean system of classification, which sought to introduce more scientific values into the classification of living things. Barely half a century old in 1818, the Linnaean system controversially classified whales as mammals because they shared two mammalian characteristics: they were warm-blooded and breathed air.',
      'So the trial began in December 1818. Judd\'s defense lawyers chose as their star witness one of New York\'s most prominent figures, the congressman Samuel Mitchill. Referred to as a "living encyclopedia" and a "walking library", Mitchill was a renowned natural history lecturer at the College of Physicians and Surgeons who liked to dare his students to test his knowledge of the natural world. "Show me the fin, and I will name the fish," he boasted. Scientifically, it was an open-and-shut case, and Judd\'s defense lawyers believed they had only one simple thing to do to win the trial: insist that it be decided by biology alone. Mitchill seemed fully qualified for this role.',
      'But this is where the case becomes interesting, and is the reason why the trial of the whale is not some dusty nineteenth-century obscurity. For rather than debate Mitchill on his area of expertise, lawyers for the New York City fish-oil inspectors chose a different tack. Lead counsel William Sampson turned the trial into a contest between scientific learning and common sense, by asking plain-spoken whalers to make their case before the jury.',
      'The crux of Sampson\'s case was the trial\'s implication with regard to humans: should Judd be found not guilty? Sampson told jury members that if they accepted Mitchill\'s testimony on whales, they were obliged to accept a lower place for their own kind in the natural order. As a result, Mitchill\'s day in court did not go smoothly, not least because he was forced to acknowledge disputes among biologists. Sampson then took aim at Mitchill himself and what he represented: privileged aristocrats from the scientific community who had lost touch with reality. The smooth-talking Sampson claimed Mitchill\'s beliefs had their origin in Europe — something he rightly judged would infuriate the citizens of always-independent New York. This revolutionary new thinking, Sampson claimed, was something that honest working New Yorkers could do without. No longer was this a case about barrels of oil, but about the proper place of scientific knowledge in the U.S.A. Ultimately, what won the case for Samuel Judd were not Mitchill\'s scientific arguments, but testimony from a different sphere altogether.',
      'In New York\'s markets, the merchants implicitly understood that whale oil and fish oil were not the same: whale oil could be used as a fuel for lamps because it could be burned without giving off smoke; fish oil, on the other hand, was nasty, impure stuff used primarily in tanning leather. In the end, it was this that led to Judd\'s victory.',
      'The trial of the whale still has relevance today, when the court of public opinion remains easily swayed by skeptics. The trial of the whale raises this question: who gets to decide on the place of scientific expertise in public opinion? Whether the issue today is the effects of human activity on the climate of this planet, or one of many other contemporary topics, the legacy of Judd\'s case continues to be of relevance.'
    ],
    groups: [
      {
        type: 'tfng',
        instructions: 'Do the following statements agree with the information given in the passage? Choose TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, or NOT GIVEN if there is no information on this.',
        questions: [
          { text: 'An inspection fee for fish oil was introduced in New York in 1818.', answer: 'FALSE', explain: 'Paragraph 1: the fee came from "an old law" — it already existed in 1818.' },
          { text: 'Samuel Judd argued that the inspection fee should exclude whale oil.', answer: 'TRUE', explain: 'Paragraph 1: Judd claimed no inspection was necessary because it was whale oil.' },
          { text: 'Judd had been in trouble with city officials before the inspection fee disagreement.', answer: 'NOT GIVEN', explain: 'The passage says nothing about Judd\'s earlier dealings with officials.' },
          { text: 'Many New Yorkers were interested in the court case at the time.', answer: 'TRUE', explain: 'Paragraph 2: "the public debate in New York sparked off by the trial was sensational."' },
          { text: 'Traditionally, non-human creatures had been classified in one of three groups.', answer: 'TRUE', explain: 'Paragraph 2: "birds, beasts, or fish".' },
          { text: 'Generally speaking, ordinary people thought fish were the lowest form of life.', answer: 'NOT GIVEN', explain: 'No ranking of fish is mentioned.' },
          { text: 'Whales were excluded from the Linnaean system in 1818.', answer: 'FALSE', explain: 'Paragraph 3: the Linnaean system classified whales as mammals — they were included.' }
        ]
      },
      {
        type: 'gap',
        instructions: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.',
        questions: [
          { text: 'Samuel Mitchill worked as a congressman and a ____.', answer: 'lecturer', explain: 'Paragraph 4: "a renowned natural history lecturer".' },
          { text: 'William Sampson called ____ as witnesses to appeal to the common sense of the jury.', answer: 'whalers', explain: 'Paragraph 5: "asking plain-spoken whalers to make their case".' },
          { text: 'New Yorkers disliked Mitchill because his ideas came from ____.', answer: 'Europe', explain: 'Paragraph 6: "Mitchill\'s beliefs had their origin in Europe".' },
          { text: 'In the end, it was statements from local ____, not Mitchill\'s testimony, which helped Judd win.', answer: 'merchants', explain: 'Paragraph 7: "the merchants implicitly understood…".' },
          { text: 'Whale oil made a good ____ because it was clean.', answer: 'fuel', explain: 'Paragraph 7: "used as a fuel for lamps… without giving off smoke".' },
          { text: 'Judd\'s case is relevant today, e.g. in the debate about Earth\'s ____.', answer: 'climate', explain: 'Paragraph 8: "the effects of human activity on the climate of this planet".' }
        ]
      }
    ]
  },

  {
    id: 'the-humble-pencil',
    title: 'The Humble Pencil',
    subtitle: 'How an ordinary object was shaped by shepherds, soldiers and a scientist',
    level: 'Passage 1',
    minutes: 20,
    topics: ['History', 'Technology'],
    labelled: true, // paragraphs are shown with letters A, B, C…
    paragraphs: [
      'Few objects are as ordinary, or as overlooked, as the pencil. Billions are manufactured every year, yet most people could not say what is inside one. The answer is not lead, and it never has been. The core of a modern pencil is a mixture of graphite and clay, and the story of how that mixture came to be involves shepherds, wartime shortages and a French scientist better known in his day for his work on balloons.',
      'The tale begins in the sixteenth century in Borrowdale, a valley in the north-west of England, where an unusually pure deposit of graphite was discovered. Local shepherds found the dark, soft material ideal for marking their sheep. Because it left a grey trace similar to that of lead, it came to be called "black lead", a name that has survived in several languages to this day. The Borrowdale graphite was so solid that it could be sawn into sticks, and before long these sticks were being wrapped in string or sheepskin so that they could be held without blackening the hands.',
      'The mineral quickly became valuable — too valuable, some would say. Graphite could be used to line the moulds in which cannonballs were cast, and the mine was brought under strict control. At times it was deliberately flooded to limit supply, and workers were searched as they left at the end of the day. For almost two centuries, England enjoyed something close to a monopoly on high-quality pencils.',
      'That monopoly was broken by war. In the 1790s France, cut off from English supplies, turned to Nicolas-Jacques Conté, a scientist and army officer, to find an alternative. Conté\'s solution was to grind lower-quality graphite into powder, mix it with clay and water, and bake the resulting paste in a kiln. The method had an unexpected advantage: by changing the proportion of clay, manufacturers could make leads that were harder or softer. The grading system that artists still use, from hard "H" pencils to soft "B" pencils, owes its existence to Conté\'s process.',
      'Later refinements were mostly practical. In 1858 an American named Hymen Lipman received a patent for a pencil with an eraser fixed to one end, although the patent was later declared invalid on the grounds that it merely combined two existing items. Towards the end of the nineteenth century, one manufacturer began painting its best pencils yellow, a colour then associated with luxury and quality, and many competitors followed suit. Today, most pencils sold in North America are still yellow.',
      'In an age of screens, the pencil might be expected to disappear. It has not. Teachers value it because mistakes can be erased; divers and mountaineers because it works under water and in freezing temperatures where ink fails; artists because of the range of tones it can produce. It is often claimed that a single pencil can draw a line more than 50 kilometres long. Whether or not that is true, the pencil\'s durability — both as an object and as an idea — is hard to deny.'
    ],
    groups: [
      {
        type: 'choice',
        instructions: 'The passage has six paragraphs, A–F. Which paragraph contains the following information? You may use any letter more than once.',
        options: ['A', 'B', 'C', 'D', 'E', 'F'].map(l => ({ value: l, label: l })),
        questions: [
          { text: 'reasons why the pencil is still in use today', answer: 'F', explain: 'Paragraph F lists teachers, divers, mountaineers and artists.' },
          { text: 'a description of measures taken to protect a valuable resource', answer: 'C', explain: 'Paragraph C: flooding the mine and searching workers.' },
          { text: 'the origin of a name that is still used', answer: 'B', explain: 'Paragraph B: why graphite was called "black lead".' },
          { text: 'an explanation of how different levels of hardness became possible', answer: 'D', explain: 'Paragraph D: changing the proportion of clay.' }
        ]
      },
      {
        type: 'tfng',
        instructions: 'Do the following statements agree with the information given in the passage? Choose TRUE, FALSE or NOT GIVEN.',
        questions: [
          { text: 'Borrowdale graphite was first used to mark animals.', answer: 'TRUE', explain: 'Paragraph B: shepherds used it for marking their sheep.' },
          { text: 'Borrowdale was the only source of graphite in Europe.', answer: 'NOT GIVEN', explain: 'The passage says England had a near-monopoly on high-quality pencils, not that there was no other graphite in Europe.' },
          { text: 'Conté\'s method depended on graphite of the highest quality.', answer: 'FALSE', explain: 'Paragraph D: he used "lower-quality graphite".' },
          { text: 'Lipman\'s patent was eventually cancelled.', answer: 'TRUE', explain: 'Paragraph E: the patent was "later declared invalid".' }
        ]
      },
      {
        type: 'gap',
        instructions: 'Complete the sentences below. Choose ONE WORD ONLY from the passage for each answer.',
        questions: [
          { text: 'Before wooden cases existed, graphite sticks were wrapped in string or ____.', answer: 'sheepskin', explain: 'Paragraph B.' },
          { text: 'Graphite was used in the moulds for making ____.', answer: ['cannonballs', 'cannon balls'], explain: 'Paragraph C.' },
          { text: 'Conté heated a paste of graphite, clay and water in a ____.', answer: 'kiln', explain: 'Paragraph D.' },
          { text: 'Yellow was chosen because the colour suggested luxury and ____.', answer: 'quality', explain: 'Paragraph E.' }
        ]
      },
      {
        type: 'choice',
        instructions: 'Choose the correct letter, A, B, C or D.',
        options: [
          { value: 'A', label: 'A — to argue that pencils are better than digital devices' },
          { value: 'B', label: 'B — to trace the development of an everyday object' },
          { value: 'C', label: 'C — to compare English and French manufacturing' },
          { value: 'D', label: 'D — to explain how pencils are made in factories today' }
        ],
        column: true,
        questions: [
          { text: 'What is the writer\'s main purpose in the passage?', answer: 'B', explain: 'The passage follows the pencil from the 16th century to the present.' }
        ]
      }
    ]
  }
];
