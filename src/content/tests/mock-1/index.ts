import type { TestDef } from '@/types/content'
import { listening } from './listening'
import { reading } from './reading'
import { speaking } from './speaking'
import { writing } from './writing'

export const mock1: TestDef = {
  id: 'mock-1',
  title: 'Full Mock Test 1',
  module: 'academic',
  kind: 'full',
  difficulty: 'intermediate',
  summary: 'A complete Academic test: four-part listening, three reading passages, two writing tasks and a recorded speaking interview.',
  topics: ['Honeybee decisions', 'Light pollution', 'The value of boredom', 'Kakapo conservation'],
  listening,
  reading,
  writing,
  speaking,
}
