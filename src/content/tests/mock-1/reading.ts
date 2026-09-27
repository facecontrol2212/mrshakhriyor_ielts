import type { ReadingSection } from '@/types/content'

export const reading: ReadingSection = {
  durationMinutes: 60,
  parts: [
    // ─── Part 1 ─────────────────────────────────────────────────────────────
    {
      id: 'r1',
      intro: 'You should spend about 20 minutes on **Questions 1–13**, which are based on Reading Passage 1 below.',
      passage: {
        title: 'Democracy in the Hive',
        subtitle: 'How a swarm of honeybees chooses a new home',
        paragraphs: [
          {
            text: 'Every spring, in forests and gardens across the temperate world, a remarkable event takes place. A colony of honeybees that has grown too large for its home splits in two. The old queen departs with roughly two-thirds of the workers — perhaps ten thousand bees — leaving the original nest to a newly reared daughter queen and the remaining workers. Within minutes the departing bees gather in a dense, beard-like cluster, often hanging from the branch of a nearby tree. There they will stay, sometimes for a few hours and sometimes for several days, while they settle a question on which their survival depends: where will they live next?',
          },
          {
            text: 'The swarm cannot afford to get the answer wrong. The bees carry only enough honey in their stomachs to survive for a few days, and a colony that chooses a cavity that is too small will not be able to store sufficient food for the winter. One that chooses a site that is damp or exposed may lose its entire population to cold or to predators. Remarkably, the decision is not made by the queen, who plays no part in the process, but by a few hundred of the oldest and most experienced foragers, which act as scouts.',
          },
          {
            text: "Much of what is known about this process comes from the work of Thomas Seeley, a biologist at Cornell University, who spent several decades studying swarms. Seeley built on earlier observations by the German zoologist Martin Lindauer, who in the 1950s noticed that some bees on the surface of a swarm were performing the same 'waggle dance' that foragers use to tell their nest-mates about sources of nectar. Lindauer realised that these dancers were not advertising flowers but potential homes.",
          },
          {
            text: "Scouts fly out in all directions, searching for hollow trees and similar spaces. When a scout finds a promising cavity, she inspects it thoroughly, walking around its interior for as long as forty minutes and assessing its volume, the size of its entrance and its height above the ground. Seeley's measurements suggest that bees favour cavities of around forty litres, with a small entrance near the bottom that is easy to defend and a location several metres above the ground. If the site meets her standards, the scout returns to the swarm and performs a dance which indicates the direction and distance of her discovery.",
          },
          {
            text: 'Crucially, the strength of the dance reflects the quality of the site. A scout that has found an excellent cavity may perform a hundred or more circuits of her dance, while one reporting a mediocre site will dance only a few circuits, or not at all. Other scouts are therefore more likely to encounter dances for the better sites, fly out to inspect them and, if they agree, return to dance for them in turn. Support for a poor site tends to fade, while support for a good one grows.',
          },
          {
            text: "Equally important is the fact that each scout's enthusiasm declines over time. A bee that returns repeatedly from the same site performs fewer circuits on each visit and eventually stops dancing altogether. This built-in decay prevents the swarm from becoming locked into an early choice simply because it was discovered first: a site can only continue to attract support if new scouts are persuaded to visit it and dance for it. Seeley and his colleagues also discovered that scouts supporting one site will sometimes deliver a 'stop signal' — a brief head-butt accompanied by a high-pitched beep — to bees dancing for a rival site, which helps to bring the debate to a close.",
          },
          {
            text: 'The swarm does not wait for every scout to agree. Instead, the scouts at each site keep track of how many other scouts are present. When the number at one site reaches a threshold of roughly fifteen bees, the scouts there return to the swarm and begin to produce a piping sound that signals the other bees to warm up their flight muscles. About an hour later, the entire swarm takes to the air, guided to its new home by scouts that fly rapidly through the cloud of bees in the right direction.',
          },
          {
            text: "To test how good the bees' decisions actually are, Seeley took swarms to Appledore Island, off the coast of Maine, where there are almost no trees and therefore few natural nest sites. He set out nest boxes that differed in a single feature, such as volume, and observed which box each swarm chose. In most trials the swarms selected the box that Seeley had predicted to be best, even when it was not the first one to be discovered.",
          },
          {
            text: 'Seeley believes that human groups could learn from the bees. The success of the swarm, he argues, depends on a group of individuals with shared interests, a variety of options, independent evaluation of each option, open debate and an effective method of reaching agreement. He has suggested that these principles could be applied to meetings of all kinds, and recommends that the leader of a group should avoid announcing a preference early in a discussion, so that other members feel free to explore the alternatives.',
          },
        ],
      },
      groups: [
        {
          id: 'r1-g1',
          type: 'tfng',
          from: 1,
          to: 7,
          instructions: [
            'Do the following statements agree with the information given in Reading Passage 1?',
            'Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, or **NOT GIVEN** if there is no information on this.',
          ],
          questions: [
            { n: 1, text: 'When a colony divides, the new queen leaves the original nest.' },
            { n: 2, text: 'A swarm may remain in its temporary cluster for more than a day.' },
            { n: 3, text: 'Swarms that choose a damp site usually move again the following year.' },
            { n: 4, text: 'The queen has the final say in choosing the new home.' },
            { n: 5, text: 'Martin Lindauer was the first scientist to observe the waggle dance.' },
            { n: 6, text: 'Bees prefer nest sites with a large entrance that allows easy access.' },
            { n: 7, text: 'A scout that has visited a site several times tends to dance for it with less energy.' },
          ],
        },
        {
          id: 'r1-g2',
          type: 'gap',
          layout: 'flowchart',
          from: 8,
          to: 13,
          title: 'How a swarm selects a nest site',
          wordLimit: { words: 2 },
          instructions: ['Complete the flow chart below.', 'Choose **NO MORE THAN TWO WORDS** from the passage for each answer.'],
          lines: [
            'The colony splits: the old queen leaves with about two-thirds of the {{8}}.',
            'Scouts inspect cavities, checking volume, entrance size and {{9}} above the ground.',
            'Scouts dance for good sites; the number of {{10}} shows how good a site is.',
            "Each scout's enthusiasm {{11}} with every return visit.",
            'Scouts may give a {{12}} to bees that are dancing for a rival site.',
            'About fifteen scouts gather at one site and then make a {{13}} sound; the swarm takes off.',
          ],
        },
      ],
    },

    // ─── Part 2 ─────────────────────────────────────────────────────────────
    {
      id: 'r2',
      intro: 'You should spend about 20 minutes on **Questions 14–26**, which are based on Reading Passage 2 below.',
      passage: {
        title: 'Losing the Dark',
        subtitle: 'Artificial light is transforming the night — and not only for astronomers',
        paragraphs: [
          {
            label: 'A',
            text: 'For almost all of human history, the night sky was a shared inheritance. Anyone who stepped outside on a clear, moonless night could see several thousand stars and the pale band of the Milky Way stretching from horizon to horizon. Today, that experience has become a rarity. A global atlas of sky brightness published in 2016 estimated that more than a third of humanity, including nearly 80 per cent of North Americans, can no longer see the Milky Way from where they live. For most city dwellers, the night sky contains only a handful of the brightest stars and planets.',
          },
          {
            label: 'B',
            text: "The cause is artificial light that escapes upwards or sideways from streetlights, buildings, car parks and advertising displays, and is then scattered by particles and molecules in the atmosphere. The result is 'skyglow', the orange or white dome of light that hangs over towns and cities and can be seen from more than a hundred kilometres away. Skyglow is only one form of light pollution. Others include glare, which dazzles drivers and pedestrians, and 'light trespass', which occurs when light spills into places where it is not wanted, such as bedrooms.",
          },
          {
            label: 'C',
            text: 'For astronomers, the consequences became obvious early. As towns expanded in the twentieth century, observatories that had been built on the edges of cities found that they could no longer observe faint objects. Many major telescopes were subsequently built in remote locations, such as mountain tops in Chile and Hawaii, and some cities near observatories introduced lighting regulations to protect them. The city of Flagstaff, Arizona, passed one of the world\'s first outdoor lighting laws in 1958, and in 2001 it became the first place to be recognised as an International Dark Sky City.',
          },
          {
            label: 'D',
            text: 'It is now clear, however, that the impact of artificial light extends well beyond astronomy. Many animals depend on natural patterns of light and darkness. Sea turtle hatchlings, for example, find their way to the ocean by heading towards the brightest horizon, which on an undeveloped beach is the moonlit sea; on a beach backed by hotels and roads, they may crawl inland instead, where they die from exhaustion or are eaten or run over. Migrating birds, many of which travel at night, can become disoriented by brightly lit buildings and circle them until they collapse or collide with the glass. Insects are drawn to lamps in vast numbers, and some ecologists suspect that artificial light is one of the factors behind the decline in insect populations reported in many parts of the world.',
          },
          {
            label: 'E',
            text: "Humans are affected too. The body's internal clock, which regulates sleep and many other processes over a roughly 24-hour cycle, is set largely by exposure to light. Light in the evening, particularly light at the blue end of the spectrum, suppresses the production of melatonin, a hormone that helps to prepare the body for sleep. Researchers have linked disrupted sleep patterns to a range of health problems, although it remains difficult to separate the effect of outdoor lighting from that of screens and indoor lights.",
          },
          {
            label: 'F',
            text: "Paradoxically, a technology that was expected to reduce light pollution may have made it worse. Light-emitting diodes, or LEDs, use far less electricity than older street lamps, and they can be directed precisely where light is needed. But because they are so cheap to run, many councils and businesses have installed more lights, or brighter ones, than before — an example of what economists call the 'rebound effect'. Moreover, many early LED streetlights produced a cold, bluish-white light, which is scattered more strongly by the atmosphere and has a greater effect on wildlife and human sleep than the warmer orange light of the sodium lamps they replaced. A study based on observations by thousands of volunteers around the world concluded that the visible night sky was growing brighter by nearly ten per cent a year — a far faster rate than satellite measurements had suggested.",
          },
          {
            label: 'G',
            text: 'The good news is that, unlike many forms of pollution, light pollution can be reversed almost instantly. The solutions are well understood: fitting shields so that lamps shine only downwards; choosing warmer colours of light; dimming or switching off lights late at night when few people are around; and simply not lighting areas that do not need it. Some towns that have adopted these measures report lower energy bills and no increase in crime or road accidents. In 2013, France introduced rules requiring shops and offices to switch off their lights during the night.',
          },
          {
            label: 'H',
            text: "Supporters of dark skies argue that there is also a cultural loss at stake. The night sky has inspired myths, calendars, navigation and scientific discovery for thousands of years, and a child who has never seen the Milky Way, they suggest, has been deprived of a connection to the universe that previous generations took for granted. 'Dark sky tourism', in which visitors travel to remote reserves to experience truly dark nights, is now a growing industry, and a number of rural communities have discovered that their darkness is an economic asset rather than a sign of isolation.",
          },
        ],
      },
      groups: [
        {
          id: 'r2-g1',
          type: 'headings',
          from: 14,
          to: 20,
          instructions: [
            'Reading Passage 2 has eight paragraphs, **A–H**.',
            'Choose the correct heading for paragraphs **B–H** from the list of headings below.',
            'Drag each heading into the gap next to the paragraph.',
          ],
          example: { paragraph: 'A', key: 'iii' },
          options: [
            { key: 'i', text: 'A problem that can be solved quickly' },
            { key: 'ii', text: 'How light affects human health' },
            { key: 'iii', text: 'The disappearance of a familiar sight' },
            { key: 'iv', text: 'Why a new technology has had unexpected results' },
            { key: 'v', text: 'Where light pollution comes from and the forms it takes' },
            { key: 'vi', text: 'The threat to wildlife' },
            { key: 'vii', text: 'The first group to be affected' },
            { key: 'viii', text: 'A reason to value darkness beyond science and health' },
            { key: 'ix', text: 'The high cost of switching to new lamps' },
            { key: 'x', text: 'Laws that have failed to protect the night' },
          ],
          questions: [
            { n: 14, paragraph: 'B' },
            { n: 15, paragraph: 'C' },
            { n: 16, paragraph: 'D' },
            { n: 17, paragraph: 'E' },
            { n: 18, paragraph: 'F' },
            { n: 19, paragraph: 'G' },
            { n: 20, paragraph: 'H' },
          ],
        },
        {
          id: 'r2-g2',
          type: 'mcq-multi',
          from: 21,
          to: 22,
          instructions: ['Choose **TWO** letters, **A–E**.'],
          stem: 'Which **TWO** effects of artificial light on animals are mentioned in the passage?',
          options: [
            { key: 'A', text: 'Young turtles move away from the sea.' },
            { key: 'B', text: 'Bats are unable to hunt successfully.' },
            { key: 'C', text: 'Birds fly around buildings until they are exhausted.' },
            { key: 'D', text: 'Fish change the time of year when they breed.' },
            { key: 'E', text: 'Plants produce flowers at the wrong time.' },
          ],
        },
        {
          id: 'r2-g3',
          type: 'gap-bank',
          from: 23,
          to: 26,
          title: 'LEDs and light pollution',
          instructions: [
            'Complete the summary using the list of words, **A–I**, below.',
            'Drag the correct word into each gap.',
          ],
          lines: [
            'Although LEDs consume much less {{23}} than older lamps, their low running costs have led to an increase in the {{24}} of lights that are installed. Early LED streetlights also gave off a bluish light that is scattered more by the {{25}}. Fortunately, the problem can be reversed quickly, for example by fitting shields or by {{26}} lights late at night.',
          ],
          options: [
            { key: 'A', text: 'electricity' },
            { key: 'B', text: 'number' },
            { key: 'C', text: 'atmosphere' },
            { key: 'D', text: 'dimming' },
            { key: 'E', text: 'money' },
            { key: 'F', text: 'colour' },
            { key: 'G', text: 'brightening' },
            { key: 'H', text: 'ground' },
            { key: 'I', text: 'heat' },
          ],
        },
      ],
    },

    // ─── Part 3 ─────────────────────────────────────────────────────────────
    {
      id: 'r3',
      intro: 'You should spend about 20 minutes on **Questions 27–40**, which are based on Reading Passage 3 below.',
      passage: {
        title: 'In Praise of Boredom',
        subtitle: 'Is the modern war on tedium doing us more harm than good?',
        paragraphs: [
          {
            text: "Few experiences are as universally disliked as boredom. We speak of being 'bored to death' or 'bored stiff', and a great deal of modern technology seems designed to ensure that we never have to endure a dull moment. Waiting for a bus, standing in a queue or sitting through a slow meeting, most of us now reach instinctively for a smartphone that offers an almost limitless supply of news, messages and entertainment. Yet a growing number of psychologists argue that in our eagerness to eliminate boredom we may be losing something of value. Boredom, they suggest, is not simply an unpleasant waste of time; it may be a signal that serves an important purpose.",
          },
          {
            text: 'Just how much people dislike being left alone with their own thoughts was demonstrated in a series of experiments published in 2014 by the social psychologist Timothy Wilson and his colleagues. Participants were asked to sit alone in a plain room for between six and fifteen minutes with nothing to do but think. Most reported that they found the experience unpleasant. In one version of the study, participants were given the option of pressing a button that delivered a mild but painful electric shock — a shock that they had previously said they would pay money to avoid. Remarkably, around two-thirds of the men and a quarter of the women chose to shock themselves at least once rather than simply sit and think.',
          },
          {
            text: 'From an evolutionary point of view, the discomfort of boredom makes sense. According to one influential theory, boredom functions rather like pain or hunger: it is an unpleasant feeling that motivates us to change our behaviour. When an activity no longer provides any reward, boredom pushes us to abandon it and to look for something more useful or more interesting to do. An animal that was content to remain indefinitely in an unproductive situation would be unlikely to thrive. On this view, boredom is not the problem but a message about a problem — and the appropriate response is not to silence the message but to act on it.',
          },
          {
            text: 'There is also evidence that boredom can make people more creative. In a study carried out in the north of England, the psychologist Sandi Mann asked one group of volunteers to spend fifteen minutes copying numbers out of a telephone directory, a task chosen precisely because it was so tedious. Afterwards, they were asked to think of as many uses as possible for a pair of plastic cups. Compared with a control group who had gone straight to the creative task, those who had endured the boring activity came up with more ideas, and more original ones. A further group who had merely read the telephone numbers, rather than copying them, performed better still, which Mann attributes to the fact that the more passive task allowed their minds to wander.',
          },
          {
            text: "Mind-wandering, it seems, is the key. When we are not focused on a demanding task, the brain does not simply switch off. Instead, a network of regions sometimes known as the 'default mode network' becomes more active, and the mind drifts between memories, plans and imaginary scenarios. This apparently aimless activity may allow us to make connections between ideas that would not otherwise occur to us, which could explain why so many people report having their best ideas in the shower or on long walks. If every spare moment is filled with external stimulation, however, the opportunity for this kind of undirected thinking may be lost.",
          },
          {
            text: "Not all researchers are persuaded, and there are good reasons for caution. Boredom is associated with a range of negative outcomes, from overeating and gambling to risk-taking and poor performance at school and work, and people who are frequently bored — sometimes described as 'boredom-prone' — also tend to report higher levels of depression and anxiety. Critics of the 'benefits of boredom' argument note that the creativity studies involved small numbers of participants and relatively short periods of boredom, and that the results may not apply to the long stretches of monotony experienced by, for example, people in repetitive jobs.",
          },
          {
            text: 'Much depends, perhaps, on what people do with their boredom. The same feeling that drives one person to take up a new hobby or reconsider their career may drive another to seek excitement in harmful ways. Boredom is not in itself good or bad; it is an invitation to change, and the value of the change depends on the choices that follow. What seems clear is that constantly reaching for distraction is not an effective way to respond. Checking a phone may relieve boredom for a moment, but it does nothing to address its causes, and the relief is so brief that the habit is rapidly reinforced.',
          },
          {
            text: 'For parents and teachers, this has practical implications. Many adults feel responsible for keeping children entertained at all times, filling their days with organised activities and screens. But children who are occasionally left with nothing to do are forced to generate their own amusement — to invent games, build things or simply daydream — and in doing so may develop the ability to occupy themselves that will serve them throughout life. Rather than rushing to rescue a child who complains of boredom, it may sometimes be wiser to let them discover what they can do about it. A little boredom, in other words, may be one of the most useful things a busy modern life can offer.',
          },
        ],
      },
      groups: [
        {
          id: 'r3-g1',
          type: 'mcq',
          from: 27,
          to: 31,
          instructions: ['Choose the correct letter, **A**, **B**, **C** or **D**.'],
          questions: [
            {
              n: 27,
              text: "What is the writer's main point in the first paragraph?",
              options: [
                { key: 'A', text: 'Modern technology has made people more easily bored.' },
                { key: 'B', text: 'Boredom may be more useful than is generally assumed.' },
                { key: 'C', text: 'Psychologists disagree about how boredom should be defined.' },
                { key: 'D', text: 'People waste a great deal of time on their smartphones.' },
              ],
            },
            {
              n: 28,
              text: "What did Wilson's experiments show?",
              options: [
                { key: 'A', text: 'Most participants enjoyed a period of quiet reflection.' },
                { key: 'B', text: 'Women found thinking alone more difficult than men did.' },
                { key: 'C', text: 'Many people preferred an unpleasant physical sensation to doing nothing.' },
                { key: 'D', text: 'Participants were willing to pay money to avoid being alone.' },
              ],
            },
            {
              n: 29,
              text: 'According to the theory described in the third paragraph, boredom',
              options: [
                { key: 'A', text: 'prevents animals from wasting energy on rewarding activities.' },
                { key: 'B', text: 'encourages us to leave situations that offer no benefit.' },
                { key: 'C', text: 'is a sign that a person is physically unwell.' },
                { key: 'D', text: 'should be ignored until the feeling passes.' },
              ],
            },
            {
              n: 30,
              text: "In Mann's study, the group that read the telephone numbers",
              options: [
                { key: 'A', text: 'found the task more tiring than the group that copied them.' },
                { key: 'B', text: 'produced fewer ideas than the control group.' },
                { key: 'C', text: 'were given a different creative task from the other groups.' },
                { key: 'D', text: 'performed best in the test of creativity.' },
              ],
            },
            {
              n: 31,
              text: 'What does the writer suggest about mind-wandering in the fifth paragraph?',
              options: [
                { key: 'A', text: 'It happens only when people are relaxing or exercising.' },
                { key: 'B', text: 'It may help people to link ideas in new ways.' },
                { key: 'C', text: 'It reduces activity in most areas of the brain.' },
                { key: 'D', text: 'It is more common in people who use smartphones.' },
              ],
            },
          ],
        },
        {
          id: 'r3-g2',
          type: 'ynng',
          from: 32,
          to: 36,
          instructions: [
            'Do the following statements agree with the claims of the writer in Reading Passage 3?',
            'Choose **YES** if the statement agrees with the claims of the writer, **NO** if the statement contradicts the claims of the writer, or **NOT GIVEN** if it is impossible to say what the writer thinks about this.',
          ],
          questions: [
            { n: 32, text: 'Most people now turn to their phones when they have nothing to do.' },
            { n: 33, text: 'Boredom has no purpose from an evolutionary perspective.' },
            { n: 34, text: 'Children today are more easily bored than children in the past.' },
            { n: 35, text: 'People who are frequently bored are more likely to report feeling anxious.' },
            { n: 36, text: 'Using a phone is an effective way of dealing with the causes of boredom.' },
          ],
        },
        {
          id: 'r3-g3',
          type: 'matching',
          display: 'drag',
          from: 37,
          to: 40,
          instructions: ['Complete each sentence with the correct ending, **A–G**, below.', 'Drag the correct ending onto each sentence.'],
          optionsTitle: 'List of endings',
          options: [
            { key: 'A', text: 'becomes more active when the mind is not focused on a task.' },
            { key: 'B', text: 'is usually a sign of depression.' },
            { key: 'C', text: 'works in a similar way to hunger or pain.' },
            { key: 'D', text: 'may learn to keep themselves occupied.' },
            { key: 'E', text: 'should be given more organised activities.' },
            { key: 'F', text: 'may not apply to people who are bored for long periods.' },
            { key: 'G', text: 'is responsible for most accidents at work.' },
          ],
          questions: [
            { n: 37, text: 'According to one theory, the unpleasant feeling of boredom' },
            { n: 38, text: "The brain's 'default mode network'" },
            { n: 39, text: 'Critics argue that the results of the creativity studies' },
            { n: 40, text: 'Children who are sometimes left with nothing to do' },
          ],
        },
      ],
    },
  ],

  answers: {
    1: {
      accept: ['FALSE'],
      evidence: 'The old queen departs with roughly two-thirds of the workers',
      explanation: 'It is the old queen that leaves; the new daughter queen stays in the original nest.',
    },
    2: {
      accept: ['TRUE'],
      evidence: 'sometimes for a few hours and sometimes for several days',
      explanation: '"Several days" is more than a day.',
    },
    3: {
      accept: ['NOT GIVEN'],
      evidence: 'One that chooses a site that is damp or exposed may lose its entire population to cold or to predators.',
      explanation: 'The passage says a damp site may be fatal, but says nothing about swarms moving again the following year.',
    },
    4: {
      accept: ['FALSE'],
      evidence: 'the decision is not made by the queen, who plays no part in the process',
      explanation: 'The queen plays no part; scouts make the decision.',
    },
    5: {
      accept: ['NOT GIVEN'],
      evidence: "noticed that some bees on the surface of a swarm were performing the same 'waggle dance' that foragers use",
      explanation: 'Lindauer noticed the dance on the surface of a swarm, but the passage does not say who first observed the waggle dance.',
    },
    6: {
      accept: ['FALSE'],
      evidence: 'with a small entrance near the bottom that is easy to defend',
      explanation: 'Bees favour a small entrance, not a large one.',
    },
    7: {
      accept: ['TRUE'],
      evidence: 'A bee that returns repeatedly from the same site performs fewer circuits on each visit',
      explanation: 'Fewer circuits on each visit = dancing with less energy.',
    },
    8: { accept: ['workers'], evidence: 'The old queen departs with roughly two-thirds of the workers' },
    9: { accept: ['height'], evidence: 'the size of its entrance and its height above the ground' },
    10: {
      accept: ['circuits'],
      evidence: 'may perform a hundred or more circuits of her dance, while one reporting a mediocre site will dance only a few circuits',
    },
    11: { accept: ['declines'], evidence: "each scout's enthusiasm declines over time" },
    12: { accept: ['stop signal'], evidence: "deliver a 'stop signal'" },
    13: { accept: ['piping'], evidence: 'begin to produce a piping sound' },
    14: {
      accept: ['v'],
      evidence: 'The cause is artificial light that escapes upwards or sideways',
      explanation: 'Paragraph B explains the sources of light pollution and its forms: skyglow, glare and light trespass.',
    },
    15: {
      accept: ['vii'],
      evidence: 'For astronomers, the consequences became obvious early.',
      explanation: 'Astronomers were the first group to be affected.',
    },
    16: {
      accept: ['vi'],
      evidence: 'Many animals depend on natural patterns of light and darkness.',
      explanation: 'Turtles, birds and insects — the paragraph is about wildlife.',
    },
    17: {
      accept: ['ii'],
      evidence: 'suppresses the production of melatonin',
      explanation: 'The paragraph describes effects on the body clock, sleep and health.',
    },
    18: {
      accept: ['iv'],
      evidence: 'a technology that was expected to reduce light pollution may have made it worse',
      explanation: 'LEDs (the new technology) led to more lights being installed.',
    },
    19: {
      accept: ['i'],
      evidence: 'light pollution can be reversed almost instantly',
      explanation: 'The paragraph lists quick solutions.',
    },
    20: {
      accept: ['viii'],
      evidence: 'there is also a cultural loss at stake',
      explanation: 'Cultural and economic value — beyond science (astronomy) and health.',
    },
    21: {
      accept: ['A'],
      evidence: 'they may crawl inland instead',
      explanation: 'A (turtles) and C (birds circling buildings) are mentioned. Bats, fish and plants are not.',
    },
    22: {
      accept: ['C'],
      evidence: 'circle them until they collapse or collide with the glass',
      explanation: 'A (turtles) and C (birds circling buildings) are mentioned. Bats, fish and plants are not.',
    },
    23: { accept: ['A'], evidence: 'use far less electricity than older street lamps', explanation: 'A — electricity' },
    24: { accept: ['B'], evidence: 'have installed more lights, or brighter ones, than before', explanation: 'B — number (more lights)' },
    25: { accept: ['C'], evidence: 'which is scattered more strongly by the atmosphere', explanation: 'C — atmosphere' },
    26: { accept: ['D'], evidence: 'dimming or switching off lights late at night', explanation: 'D — dimming' },
    27: {
      accept: ['B'],
      evidence: 'in our eagerness to eliminate boredom we may be losing something of value',
      explanation: 'The paragraph ends by suggesting boredom "may be a signal that serves an important purpose".',
    },
    28: {
      accept: ['C'],
      evidence: 'chose to shock themselves at least once rather than simply sit and think',
      explanation: 'An electric shock (an unpleasant physical sensation) was preferred to thinking alone. More men than women did this, so B is wrong.',
    },
    29: {
      accept: ['B'],
      evidence: 'When an activity no longer provides any reward, boredom pushes us to abandon it',
    },
    30: {
      accept: ['D'],
      evidence: 'A further group who had merely read the telephone numbers, rather than copying them, performed better still',
    },
    31: {
      accept: ['B'],
      evidence: 'may allow us to make connections between ideas that would not otherwise occur to us',
    },
    32: {
      accept: ['YES'],
      evidence: 'most of us now reach instinctively for a smartphone',
    },
    33: {
      accept: ['NO'],
      evidence: 'From an evolutionary point of view, the discomfort of boredom makes sense.',
    },
    34: {
      accept: ['NOT GIVEN'],
      evidence: 'Many adults feel responsible for keeping children entertained at all times',
      explanation: 'The writer discusses how adults entertain children, but never compares children today with children in the past.',
    },
    35: {
      accept: ['YES'],
      evidence: 'also tend to report higher levels of depression and anxiety',
    },
    36: {
      accept: ['NO'],
      evidence: 'it does nothing to address its causes',
    },
    37: { accept: ['C'], evidence: 'boredom functions rather like pain or hunger' },
    38: { accept: ['A'], evidence: "a network of regions sometimes known as the 'default mode network' becomes more active" },
    39: { accept: ['F'], evidence: 'the results may not apply to the long stretches of monotony' },
    40: { accept: ['D'], evidence: 'may develop the ability to occupy themselves' },
  },
}
