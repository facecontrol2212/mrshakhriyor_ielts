import { useCallback, useState } from 'react'
import { getPreference, setPreference } from '@/lib/storage'

export type TextSize = 'standard' | 'large' | 'xlarge'
export type Contrast = 'black-on-white' | 'white-on-black' | 'yellow-on-black'

export interface ExamSettings {
  textSize: TextSize
  contrast: Contrast
  volume: number
}

const DEFAULTS: ExamSettings = { textSize: 'standard', contrast: 'black-on-white', volume: 0.9 }

/** Display settings candidates can change during the test (persisted per device). */
export function useExamSettings() {
  const [settings, setSettings] = useState<ExamSettings>(() => ({ ...DEFAULTS, ...getPreference('exam-settings', {}) }))
  const update = useCallback((patch: Partial<ExamSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      setPreference('exam-settings', next)
      return next
    })
  }, [])
  return [settings, update] as const
}
