import { useSyncExternalStore } from 'react'
import type { Attempt, Profile } from '@/types/attempt'

/**
 * Local-first persistence. Everything lives in localStorage under a
 * versioned prefix so the data model can evolve; speaking recordings are
 * binary and go to IndexedDB instead (see recordings.ts).
 */
const PREFIX = 'msi:v1:'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Could not save ${key}`, error)
    return false
  }
}

function remove(key: string) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    // storage unavailable — nothing to remove
  }
}

// ─── Change notification ───────────────────────────────────────────────────

const listeners = new Set<() => void>()
let attemptsCache: Attempt[] | null = null
let profileCache: Profile | null | undefined

function emit() {
  attemptsCache = null
  profileCache = undefined
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key?.startsWith(PREFIX)) emit()
  })
}

// ─── Attempts ───────────────────────────────────────────────────────────────

function attemptIds(): string[] {
  return read<string[]>('attempts', [])
}

export function getAttempt(id: string): Attempt | undefined {
  return read<Attempt | undefined>(`attempt:${id}`, undefined)
}

export function listAttempts(): Attempt[] {
  if (!attemptsCache) {
    attemptsCache = attemptIds()
      .map((id) => getAttempt(id))
      .filter((a): a is Attempt => Boolean(a))
      .sort((a, b) => b.createdAt - a.createdAt)
  }
  return attemptsCache
}

export function saveAttempt(attempt: Attempt): boolean {
  const ok = write(`attempt:${attempt.id}`, attempt)
  const ids = attemptIds()
  if (!ids.includes(attempt.id)) write('attempts', [...ids, attempt.id])
  emit()
  return ok
}

export function deleteAttempt(id: string) {
  remove(`attempt:${id}`)
  write(
    'attempts',
    attemptIds().filter((x) => x !== id),
  )
  emit()
}

export function useAttempts(): Attempt[] {
  return useSyncExternalStore(subscribe, listAttempts, listAttempts)
}

// ─── Profile ────────────────────────────────────────────────────────────────

export function getProfile(): Profile | null {
  if (profileCache === undefined) profileCache = read<Profile | null>('profile', null)
  return profileCache
}

export function saveProfile(profile: Profile) {
  write('profile', profile)
  emit()
}

export function useProfile(): Profile | null {
  return useSyncExternalStore(subscribe, getProfile, getProfile)
}

// ─── Small preferences ──────────────────────────────────────────────────────

export function getPreference<T>(key: string, fallback: T): T {
  return read<T>(`pref:${key}`, fallback)
}

export function setPreference(key: string, value: unknown) {
  write(`pref:${key}`, value)
}

// ─── Backup ─────────────────────────────────────────────────────────────────

interface Backup {
  app: 'mrshakhriyor-ielts'
  version: 1
  exportedAt: string
  profile: Profile | null
  attempts: Attempt[]
}

export function exportBackup(): string {
  const backup: Backup = {
    app: 'mrshakhriyor-ielts',
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: getProfile(),
    attempts: listAttempts(),
  }
  return JSON.stringify(backup, null, 2)
}

/** Merge a backup into local data. Returns the number of attempts imported. */
export function importBackup(json: string): number {
  const data = JSON.parse(json) as Partial<Backup>
  if (data.app !== 'mrshakhriyor-ielts' || !Array.isArray(data.attempts)) throw new Error('This file is not a progress backup.')
  if (data.profile && !getProfile()) write('profile', data.profile)
  const ids = new Set(attemptIds())
  let imported = 0
  for (const attempt of data.attempts) {
    if (!attempt?.id || !attempt.testId) continue
    write(`attempt:${attempt.id}`, attempt)
    if (!ids.has(attempt.id)) imported++
    ids.add(attempt.id)
  }
  write('attempts', [...ids])
  emit()
  return imported
}
