import type { WritingSection } from '@/types/content'

export const writing: WritingSection = {
  durationMinutes: 60,
  tasks: [
    {
      id: 'w1',
      number: 1,
      minWords: 150,
      suggestedMinutes: 20,
      prompt: [
        'You should spend about 20 minutes on this task.',
        '**The graph below shows the percentage of households in one country that owned a desktop computer, a laptop and a tablet between 2000 and 2020.**',
        '**Summarise the information by selecting and reporting the main features, and make comparisons where relevant.**',
        'Write at least 150 words.',
      ],
      visual: {
        kind: 'line',
        title: 'Households owning each type of device (%)',
        xLabels: ['2000', '2004', '2008', '2012', '2016', '2020'],
        yLabel: '% of households',
        yMax: 80,
        yStep: 10,
        unit: '%',
        series: [
          { name: 'Desktop computer', values: [45, 58, 62, 55, 41, 30] },
          { name: 'Laptop', values: [5, 14, 35, 56, 68, 74] },
          { name: 'Tablet', values: [null, null, 3, 24, 42, 47] },
        ],
      },
      modelAnswer: {
        band: 8.5,
        text: `The line graph compares the proportion of households in one country that owned three kinds of computing device — desktop computers, laptops and tablets — over a twenty-year period from 2000 to 2020.

Overall, ownership of desktop computers rose and then fell, while laptops and tablets became steadily more common. By the end of the period, laptops had become by far the most widely owned device, and desktops were the least common of the three.

In 2000, 45% of households had a desktop computer, compared with only 5% that owned a laptop. Desktop ownership climbed to a peak of 62% in 2008, but it declined continuously after that, falling to 30% by 2020, less than half of its highest level.

Laptops, by contrast, grew in popularity throughout the period. Their share of households rose gradually at first, to 14% in 2004, before increasing sharply to 56% in 2012, when laptops overtook desktops for the first time. The figure continued to climb, reaching almost three-quarters of households (74%) in 2020.

Tablets were first recorded in 2008, when only 3% of households owned one. Ownership then grew rapidly to 42% in 2016, overtaking desktops in the same year, before levelling off at 47% in 2020.`,
        notes: [
          'The introduction paraphrases the task instead of copying it.',
          'A clear overview gives the main trends and the final ranking without any numbers.',
          'Each body paragraph follows one device and compares it with the others at key moments (2012, 2016).',
          'Accurate data selection: peaks, crossing points and end values, not every figure.',
          'Varied language for change: climbed to a peak, declined continuously, levelling off, overtook.',
        ],
      },
    },
    {
      id: 'w2',
      number: 2,
      minWords: 250,
      suggestedMinutes: 40,
      prompt: [
        'You should spend about 40 minutes on this task.',
        'Write about the following topic:',
        '**Some people believe that university students should be required to study subjects outside their main area, for example art or history for science students. Others think that students should focus only on the subject they have chosen.**',
        '**Discuss both these views and give your own opinion.**',
        'Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
        'Write at least 250 words.',
      ],
      modelAnswer: {
        band: 8.5,
        text: `In many countries, university students specialise in a single subject from their first day, while in others they are expected to take a range of courses before choosing a major. Both approaches have their supporters, and although there are strong arguments for specialisation, I believe that some study outside one's main field is valuable.

Those who favour a narrow focus argue that degrees are already short and that modern subjects demand a great deal of specialised knowledge. A medical student, for instance, must master an enormous amount of scientific content in a limited time, and hours spent on art history might seem like a distraction from this goal. Moreover, students often pay high fees, and many would prefer to spend them on courses that lead directly to employment. From this perspective, compulsory courses in unrelated subjects are an expensive luxury.

On the other hand, there are persuasive reasons to broaden students' education. Many of the most pressing problems facing society, such as climate change or the ethical use of artificial intelligence, cannot be solved from within a single discipline. An engineer who has studied some philosophy may be better equipped to consider the social consequences of the technology she designs, while a history student who has taken a course in statistics will be able to evaluate evidence more rigorously. In addition, employers increasingly value skills such as communication and critical thinking, which are often developed most effectively by encountering unfamiliar ways of thinking.

In my view, the benefits of a broader education outweigh the costs, provided that the requirement is modest. Universities should not force students to divide their time equally between subjects, but one or two courses outside their specialism would help them become more flexible thinkers and more responsible professionals. Specialists who can see beyond their own field are, after all, exactly what the modern world needs.`,
        notes: [
          'The position is stated in the introduction and repeated, with a condition, in the conclusion.',
          'Each view gets its own paragraph with a clear topic sentence and a specific example.',
          'Cohesion comes from ideas, not just linking words: "From this perspective", "provided that".',
          'Precise vocabulary: specialise, discipline, rigorously, an expensive luxury.',
          'A mix of complex structures (conditionals, relative clauses) with no loss of clarity.',
        ],
      },
    },
  ],
}
