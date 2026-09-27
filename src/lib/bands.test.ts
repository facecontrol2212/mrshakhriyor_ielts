import { describe, expect, it } from 'vitest'
import { bandLabel, criteriaBand, overallBand, rawRangeForBand, rawToBand, writingBand } from './bands'

describe('rawToBand', () => {
  it('converts listening scores at the published cut-offs', () => {
    expect(rawToBand('listening', 40)).toBe(9)
    expect(rawToBand('listening', 35)).toBe(8)
    expect(rawToBand('listening', 30)).toBe(7)
    expect(rawToBand('listening', 29)).toBe(6.5)
    expect(rawToBand('listening', 23)).toBe(6)
    expect(rawToBand('listening', 16)).toBe(5)
    expect(rawToBand('listening', 0)).toBe(0)
  })

  it('uses different tables for Academic and General Training reading', () => {
    expect(rawToBand('reading', 30, 40, 'academic')).toBe(7)
    expect(rawToBand('reading', 30, 40, 'general')).toBe(6)
    expect(rawToBand('reading', 23, 40, 'academic')).toBe(6)
    expect(rawToBand('reading', 23, 40, 'general')).toBe(5)
  })

  it('projects shorter practice sets onto 40 questions', () => {
    expect(rawToBand('reading', 13, 13)).toBe(9)
    expect(rawToBand('reading', 10, 13)).toBe(7)
  })

  it('reports the raw range for a band', () => {
    expect(rawRangeForBand('listening', 7)).toEqual([30, 31])
    expect(rawRangeForBand('reading', 9)).toEqual([39, 40])
  })
})

describe('overallBand', () => {
  it('rounds .25 up to .5 and .75 up to the next band', () => {
    expect(overallBand([6.5, 6.5, 5.5, 6.5])).toBe(6.5) // 6.25
    expect(overallBand([7, 7, 6.5, 6.5])).toBe(7) // 6.75
    expect(overallBand([6.5, 6.5, 5.5, 6])).toBe(6) // 6.125
    expect(overallBand([7.5, 7, 5.5, 5.5])).toBe(6.5) // 6.375
  })
})

describe('criterion bands', () => {
  it('averages criteria and rounds down to a half band', () => {
    expect(criteriaBand([6, 6, 5, 6])).toBe(5.5)
    expect(criteriaBand([7, 7, 7, 7])).toBe(7)
    expect(criteriaBand([7, 7, 6, 7])).toBe(6.5)
  })

  it('counts Task 2 twice as much as Task 1', () => {
    expect(writingBand(6, 7)).toBe(6.5)
    expect(writingBand(8, 6)).toBe(6.5)
    expect(writingBand(6, 5.5)).toBe(5.5)
  })
})

describe('bandLabel', () => {
  it('names the skill level', () => {
    expect(bandLabel(9)).toBe('Expert user')
    expect(bandLabel(6.5)).toBe('Competent user')
    expect(bandLabel(0)).toBe('Did not attempt')
  })
})
