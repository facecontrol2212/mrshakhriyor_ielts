import type { Skill, TestDef } from '@/types/content'
import { mock1 } from './mock-1'
import { practiceWhale } from './practice-whale'

/** Every test on the site. Add new tests here. */
export const TESTS: TestDef[] = [mock1, practiceWhale]

export function getTest(id: string): TestDef | undefined {
  return TESTS.find((t) => t.id === id)
}

export function testSkills(test: TestDef): Skill[] {
  return (['listening', 'reading', 'writing', 'speaking'] as const).filter((skill) => Boolean(test[skill]))
}
