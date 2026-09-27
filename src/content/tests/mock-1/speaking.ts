import type { SpeakingSection } from '@/types/content'

export const speaking: SpeakingSection = {
  examiner: { name: 'Emma', voice: 'bf_emma' },
  part1: {
    intro: [
      {
        id: 'p1-intro-1',
        text: "Good morning. My name is Emma, and I'll be your examiner today. Can you tell me your full name, please?",
        answerSeconds: 10,
      },
      { id: 'p1-intro-2', text: 'Thank you. And can you tell me where you are from?', answerSeconds: 15 },
      {
        id: 'p1-intro-3',
        text: "Thank you. Now, in this first part, I'd like to ask you some questions about yourself.",
        answerSeconds: 0,
      },
    ],
    topics: [
      {
        title: 'Work or studies',
        questions: [
          { id: 'p1-work-1', text: 'Do you work, or are you a student?', answerSeconds: 25 },
          { id: 'p1-work-2', text: 'What do you enjoy most about your work or your studies?', answerSeconds: 30 },
          { id: 'p1-work-3', text: 'Is there anything you would like to change about it?', answerSeconds: 30 },
        ],
      },
      {
        title: 'Music',
        questions: [
          { id: 'p1-music-1', text: "Let's talk about music. What kind of music do you enjoy?", answerSeconds: 30 },
          { id: 'p1-music-2', text: 'Did you learn to play a musical instrument when you were a child?', answerSeconds: 30 },
          { id: 'p1-music-3', text: 'Do you prefer listening to music alone or with other people?', answerSeconds: 30 },
          { id: 'p1-music-4', text: 'Has your taste in music changed as you have got older?', answerSeconds: 30 },
        ],
      },
      {
        title: 'Weather',
        questions: [
          {
            id: 'p1-weather-1',
            text: "Now let's talk about the weather. What's the weather usually like where you live?",
            answerSeconds: 30,
          },
          { id: 'p1-weather-2', text: 'Does the weather ever affect your mood?', answerSeconds: 30 },
          { id: 'p1-weather-3', text: "What's your favourite season of the year? Why?", answerSeconds: 30 },
        ],
      },
    ],
  },
  part2: {
    intro: {
      id: 'p2-intro',
      text: "Now I'm going to give you a topic, and I'd like you to talk about it for one to two minutes. Before you talk, you'll have one minute to think about what you're going to say. You can make some notes if you wish. Here is your topic. I'd like you to describe a skill that you learned as an adult.",
      answerSeconds: 0,
    },
    cueCard: {
      topic: 'Describe a skill that you learned as an adult.',
      intro: 'You should say:',
      points: ['what the skill is', 'how you learned it', 'how long it took you to learn it'],
      closing: 'and explain how this skill has been useful to you.',
    },
    start: {
      id: 'p2-start',
      text: "All right? Remember, you have one to two minutes for this, so don't worry if I stop you. I'll tell you when the time is up. Can you start speaking now, please?",
      answerSeconds: 0,
    },
    prepSeconds: 60,
    talkSeconds: 120,
    followUp: {
      id: 'p2-followup',
      text: 'Thank you. Do you think it is easier to learn new skills as a child or as an adult?',
      answerSeconds: 20,
    },
  },
  part3: {
    intro: {
      id: 'p3-intro',
      text: "We've been talking about a skill you learned, and I'd like to discuss with you one or two more general questions related to this. Let's consider, first of all, learning practical skills.",
      answerSeconds: 0,
    },
    questions: [
      { id: 'p3-q1', text: 'What practical skills do you think young people should learn at school?', answerSeconds: 60 },
      {
        id: 'p3-q2',
        text: 'Some people say that learning a skill online is just as effective as learning it from a teacher. What do you think?',
        answerSeconds: 60,
      },
      { id: 'p3-q3', text: 'Why do you think some adults find it difficult to learn new things?', answerSeconds: 60 },
      {
        id: 'p3-q4',
        text: "Let's move on to talk about skills and work. How have the skills that employers want changed in recent years?",
        answerSeconds: 60,
      },
      { id: 'p3-q5', text: 'Should companies pay for their staff to learn new skills? Why?', answerSeconds: 60 },
      { id: 'p3-q6', text: 'Which skills do you think will become less important in the future?', answerSeconds: 60 },
    ],
  },
  closing: { id: 'closing', text: 'Thank you. That is the end of the speaking test.', answerSeconds: 0 },
}
