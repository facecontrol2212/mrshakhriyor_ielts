/* Writing prompts. Task 1 (Academic) prompts can include a simple `chart` that is drawn as SVG. */
window.IELTS_DATA = window.IELTS_DATA || {};
window.IELTS_DATA.writingPrompts = [
  {
    id: 't1-internet-use',
    task: 1,
    type: 'Academic — Bar chart',
    minutes: 20,
    minWords: 150,
    prompt: 'The bar chart below shows the percentage of adults in three age groups who used the internet daily in a European country in 2005, 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chart: {
      unit: '%',
      max: 100,
      categories: ['2005', '2015', '2025'],
      series: [
        { name: '16–34', values: [58, 91, 98] },
        { name: '35–54', values: [37, 78, 95] },
        { name: '55+', values: [12, 46, 81] }
      ]
    }
  },
  {
    id: 't1-letter-neighbour',
    task: 1,
    type: 'General Training — Letter',
    minutes: 20,
    minWords: 150,
    prompt: 'Your neighbour has recently started renovating their flat, and the noise is causing you problems. Write a letter to your neighbour. In your letter:\n• explain how the noise is affecting you\n• describe what you have already tried to do about it\n• suggest a solution\nBegin your letter as follows: Dear ………,'
  },
  {
    id: 't2-online-learning',
    task: 2,
    type: 'Opinion essay',
    minutes: 40,
    minWords: 250,
    prompt: 'Some people believe that online courses will eventually replace traditional classroom learning. To what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.'
  },
  {
    id: 't2-city-traffic',
    task: 2,
    type: 'Problem & solution',
    minutes: 40,
    minWords: 250,
    prompt: 'Traffic congestion is becoming a serious problem in many large cities. What are the causes of this problem, and what measures could be taken to solve it?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.'
  },
  {
    id: 't2-work-abroad',
    task: 2,
    type: 'Discuss both views',
    minutes: 40,
    minWords: 250,
    prompt: 'Some people think young people should work or travel abroad for a year before starting university. Others believe they should begin their studies immediately. Discuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.'
  },
  {
    id: 't2-advertising-children',
    task: 2,
    type: 'Advantages & disadvantages',
    minutes: 40,
    minWords: 250,
    prompt: 'More and more advertising is aimed at children. Do the advantages of this outweigh the disadvantages?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.'
  }
];

/* Self-assessment checklist based on the four public IELTS Writing criteria. */
window.IELTS_DATA.writingCriteria = [
  {
    name: 'Task Achievement / Response',
    checks: [
      'I answered every part of the question',
      'My position (Task 2) or overview (Task 1) is clear',
      'Main ideas are extended and supported with examples or data'
    ]
  },
  {
    name: 'Coherence & Cohesion',
    checks: [
      'Each paragraph has one clear central idea',
      'I used linking words accurately, not mechanically',
      'Pronouns and referencing are clear'
    ]
  },
  {
    name: 'Lexical Resource',
    checks: [
      'I avoided repeating the same words from the question',
      'I used some less common vocabulary and collocations',
      'Spelling has been checked'
    ]
  },
  {
    name: 'Grammatical Range & Accuracy',
    checks: [
      'I used a mix of simple and complex sentences',
      'Tenses and subject–verb agreement are correct',
      'Punctuation (commas, full stops) has been checked'
    ]
  }
];
