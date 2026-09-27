import type { Module } from '@/types/content'

/** [minimum raw score out of 40, band] from highest to lowest. */
type BandTable = readonly (readonly [number, number])[]

// Widely used conversion tables. The exact cut-offs vary slightly between
// test versions, so results are always presented as an estimate.
export const LISTENING_TABLE: BandTable = [
  [39, 9],
  [37, 8.5],
  [35, 8],
  [32, 7.5],
  [30, 7],
  [26, 6.5],
  [23, 6],
  [18, 5.5],
  [16, 5],
  [13, 4.5],
  [10, 4],
  [8, 3.5],
  [6, 3],
  [4, 2.5],
  [2, 2],
  [1, 1],
  [0, 0],
]

export const ACADEMIC_READING_TABLE: BandTable = [
  [39, 9],
  [37, 8.5],
  [35, 8],
  [33, 7.5],
  [30, 7],
  [27, 6.5],
  [23, 6],
  [19, 5.5],
  [15, 5],
  [13, 4.5],
  [10, 4],
  [8, 3.5],
  [6, 3],
  [4, 2.5],
  [2, 2],
  [1, 1],
  [0, 0],
]

export const GENERAL_READING_TABLE: BandTable = [
  [40, 9],
  [39, 8.5],
  [37, 8],
  [36, 7.5],
  [34, 7],
  [32, 6.5],
  [30, 6],
  [27, 5.5],
  [23, 5],
  [19, 4.5],
  [15, 4],
  [12, 3.5],
  [9, 3],
  [6, 2.5],
  [3, 2],
  [1, 1],
  [0, 0],
]

function lookup(table: BandTable, raw: number): number {
  for (const [min, band] of table) if (raw >= min) return band
  return 0
}

/**
 * Convert a raw score to a band. Sections shorter than 40 questions (single
 * passage practice) are projected to a 40-question scale first.
 */
export function rawToBand(skill: 'listening' | 'reading', raw: number, total = 40, module: Module = 'academic'): number {
  const projected = total === 40 ? raw : Math.round((raw / Math.max(total, 1)) * 40)
  const table = skill === 'listening' ? LISTENING_TABLE : module === 'general' ? GENERAL_READING_TABLE : ACADEMIC_READING_TABLE
  return lookup(table, Math.max(0, Math.min(40, projected)))
}

/** Raw score range that gives a band, e.g. 30–31 for Listening 7.0. */
export function rawRangeForBand(skill: 'listening' | 'reading', band: number, module: Module = 'academic'): [number, number] | null {
  const table = skill === 'listening' ? LISTENING_TABLE : module === 'general' ? GENERAL_READING_TABLE : ACADEMIC_READING_TABLE
  const index = table.findIndex(([, b]) => b === band)
  if (index === -1) return null
  const min = table[index][0]
  const max = index === 0 ? 40 : table[index - 1][0] - 1
  return [min, max]
}

/**
 * Overall band: the mean of the four skills rounded to the nearest half band,
 * where .25 rounds up to .5 and .75 rounds up to the next whole band.
 */
export function overallBand(bands: number[]): number {
  if (bands.length === 0) return 0
  const mean = bands.reduce((sum, b) => sum + b, 0) / bands.length
  return Math.round(mean * 2) / 2
}

/** Criterion-based bands (writing, speaking) are averaged and rounded down to a half band. */
export function criteriaBand(scores: number[]): number {
  if (scores.length === 0) return 0
  const mean = scores.reduce((sum, b) => sum + b, 0) / scores.length
  return Math.floor(mean * 2 + 1e-9) / 2
}

/** Writing: Task 2 counts twice as much as Task 1. */
export function writingBand(task1: number, task2: number): number {
  return Math.floor(((task1 + task2 * 2) / 3) * 2 + 1e-9) / 2
}

export function formatBand(band: number | null | undefined): string {
  if (band === null || band === undefined || Number.isNaN(band)) return '–'
  return band.toFixed(1)
}

const USER_LABELS = [
  'Did not attempt',
  'Non-user',
  'Intermittent user',
  'Extremely limited user',
  'Limited user',
  'Modest user',
  'Competent user',
  'Good user',
  'Very good user',
  'Expert user',
] as const

/** The skill level name for a band (half bands take the whole band below). */
export function bandLabel(band: number): string {
  return USER_LABELS[Math.max(0, Math.min(9, Math.floor(band)))]
}
