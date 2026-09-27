import { beforeEach, describe, expect, it } from 'vitest'
import { mock1 } from '@/content/tests/mock-1'
import { createAttempt, finishSection, startSection, summarize } from './attempts'
import { deleteAttempt, exportBackup, getAttempt, importBackup, listAttempts, saveAttempt } from './storage'

beforeEach(() => localStorage.clear())

describe('attempt storage', () => {
  it('saves, lists and deletes attempts', () => {
    const a = createAttempt(mock1, ['reading'], 'exam', 'Aziza')
    saveAttempt(a)
    expect(getAttempt(a.id)?.candidate.name).toBe('Aziza')
    expect(listAttempts().map((x) => x.id)).toEqual([a.id])
    deleteAttempt(a.id)
    expect(listAttempts()).toEqual([])
  })

  it('round-trips a backup file', () => {
    const a = createAttempt(mock1, ['listening', 'reading'], 'practice', 'Timur')
    saveAttempt(a)
    const json = exportBackup()
    localStorage.clear()
    expect(importBackup(json)).toBe(1)
    expect(getAttempt(a.id)?.skills).toEqual(['listening', 'reading'])
  })

  it('rejects files that are not backups', () => {
    expect(() => importBackup('{"hello":1}')).toThrow()
  })
})

describe('attempt lifecycle', () => {
  it('runs sections in order and completes the attempt', () => {
    let a = createAttempt(mock1, ['listening', 'reading'], 'exam', 'Aziza')
    a = startSection(a, mock1, 'listening', 1_000)
    expect(a.sections.listening?.endsAt).toBeGreaterThan(1_000 + 20 * 60_000)
    a = finishSection(a, 'listening', 2_000)
    expect(a.current).toBe(1)
    expect(a.status).toBe('in-progress')
    a = startSection(a, mock1, 'reading', 3_000)
    expect(a.sections.reading?.endsAt).toBe(3_000 + 60 * 60_000)
    a = finishSection(a, 'reading', 4_000)
    expect(a.status).toBe('completed')
    expect(summarize(a, mock1).bands).toEqual({ listening: 0, reading: 0 })
  })

  it('has no deadline in practice mode', () => {
    const a = startSection(createAttempt(mock1, ['reading'], 'practice', 'A'), mock1, 'reading')
    expect(a.sections.reading?.endsAt).toBeUndefined()
  })
})
