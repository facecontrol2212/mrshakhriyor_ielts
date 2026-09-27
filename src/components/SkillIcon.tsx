import { BookOpen, Headphones, MessageCircle, PenLine } from 'lucide-react'
import { SKILL_COLOR } from '@/lib/skills'
import type { Skill } from '@/types/content'

const ICONS = { listening: Headphones, reading: BookOpen, writing: PenLine, speaking: MessageCircle }

export function SkillIcon({ skill, size = 16, className = '' }: { skill: Skill; size?: number; className?: string }) {
  const Icon = ICONS[skill]
  return <Icon size={size} className={className} style={{ color: SKILL_COLOR[skill] }} aria-hidden />
}
