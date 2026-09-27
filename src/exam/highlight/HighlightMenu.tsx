import { Eraser, Highlighter, StickyNote, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { addHighlight, overlapsHighlight, removeHighlight } from '@/lib/highlights'
import { useExam } from '../ExamContext'

interface Target {
  blockId: string
  start: number
  end: number
}

interface MenuState {
  x: number
  y: number
  targets: Target[]
  /** Set when the menu was opened on an existing highlight. */
  existing?: { blockId: string; id: string }
}

interface NoteState {
  x: number
  y: number
  blockId: string
  id: string
  text: string
}

function textOffset(root: Element, node: Node, offset: number): number {
  const range = document.createRange()
  range.setStart(root, 0)
  range.setEnd(node, offset)
  return range.toString().length
}

/** Map the current selection onto highlightable blocks inside the container. */
function selectionTargets(container: HTMLElement): { targets: Target[]; rect: DOMRect | null } {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return { targets: [], rect: null }
  const range = selection.getRangeAt(0)
  if (!container.contains(range.commonAncestorContainer)) return { targets: [], rect: null }
  const targets: Target[] = []
  for (const block of container.querySelectorAll<HTMLElement>('[data-hl-block]')) {
    if (!range.intersectsNode(block)) continue
    const length = block.textContent?.length ?? 0
    const start = block.contains(range.startContainer) ? textOffset(block, range.startContainer, range.startOffset) : 0
    const end = block.contains(range.endContainer) ? textOffset(block, range.endContainer, range.endOffset) : length
    if (end > start) targets.push({ blockId: block.dataset.hlBlock!, start, end })
  }
  return { targets, rect: range.getBoundingClientRect() }
}

/**
 * Select text anywhere in the passage or questions to highlight it or attach
 * a note — by the floating toolbar or by right-clicking, as in the real test.
 */
export function HighlightMenu({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const { highlights, setHighlights, readOnly } = useExam()
  const [menu, setMenu] = useState<MenuState | null>(null)
  const [note, setNote] = useState<NoteState | null>(null)
  const highlightsRef = useRef(highlights)
  useEffect(() => {
    highlightsRef.current = highlights
  }, [highlights])

  const openFromSelection = useCallback(
    (point?: { x: number; y: number }) => {
      const container = containerRef.current
      if (!container) return false
      const { targets, rect } = selectionTargets(container)
      if (!targets.length || !rect) return false
      setMenu({ x: point?.x ?? rect.left + rect.width / 2, y: point?.y ?? rect.top, targets })
      return true
    },
    [containerRef],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container || readOnly) return

    const onPointerUp = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest('[data-hl-menu]')) return
      window.setTimeout(() => {
        if (!openFromSelection()) {
          const mark = (event.target as HTMLElement).closest<HTMLElement>('mark[data-hl-id]')
          const block = mark?.closest<HTMLElement>('[data-hl-block]')
          if (mark && block && event.button === 0) {
            const existing = { blockId: block.dataset.hlBlock!, id: mark.dataset.hlId! }
            const h = highlightsRef.current[existing.blockId]?.find((x) => x.id === existing.id)
            if (h?.note) setNote({ x: event.clientX, y: event.clientY, ...existing, text: h.note })
            else setMenu({ x: event.clientX, y: event.clientY, targets: [], existing })
          } else setMenu(null)
        }
      }, 0)
    }

    const onContextMenu = (event: MouseEvent) => {
      const mark = (event.target as HTMLElement).closest<HTMLElement>('mark[data-hl-id]')
      const block = mark?.closest<HTMLElement>('[data-hl-block]')
      if (openFromSelection({ x: event.clientX, y: event.clientY })) {
        event.preventDefault()
      } else if (mark && block) {
        event.preventDefault()
        setMenu({ x: event.clientX, y: event.clientY, targets: [], existing: { blockId: block.dataset.hlBlock!, id: mark.dataset.hlId! } })
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.shiftKey) openFromSelection()
      if (event.key === 'Escape') setMenu(null)
    }

    container.addEventListener('pointerup', onPointerUp)
    container.addEventListener('contextmenu', onContextMenu)
    container.addEventListener('keyup', onKeyUp)
    return () => {
      container.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('contextmenu', onContextMenu)
      container.removeEventListener('keyup', onKeyUp)
    }
  }, [containerRef, openFromSelection, readOnly])

  // Close the menu when the page scrolls under it.
  useEffect(() => {
    if (!menu) return
    const close = () => setMenu(null)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [menu])

  if (readOnly) return null

  const apply = (action: 'highlight' | 'note' | 'clear') => {
    if (!menu) return
    const selection = window.getSelection()
    if (menu.existing) {
      const { blockId, id } = menu.existing
      const list = highlights[blockId] ?? []
      const h = list.find((x) => x.id === id)
      if (!h) return setMenu(null)
      if (action === 'clear') setHighlights(blockId, list.filter((x) => x.id !== id))
      if (action === 'note') setNote({ x: menu.x, y: menu.y, blockId, id, text: h.note ?? '' })
      return setMenu(null)
    }
    let noteTarget: NoteState | null = null
    for (const t of menu.targets) {
      const list = highlights[t.blockId] ?? []
      if (action === 'clear') {
        setHighlights(t.blockId, removeHighlight(list, t.start, t.end))
        continue
      }
      const next = addHighlight(list, t.start, t.end)
      setHighlights(t.blockId, next)
      const created = next.find((h) => h.start <= t.start && h.end >= t.end)
      if (action === 'note' && !noteTarget && created)
        noteTarget = { x: menu.x, y: menu.y, blockId: t.blockId, id: created.id, text: created.note ?? '' }
    }
    if (noteTarget) setNote(noteTarget)
    selection?.removeAllRanges()
    setMenu(null)
  }

  const saveNote = (text: string | null) => {
    if (!note) return
    const list = highlights[note.blockId] ?? []
    setHighlights(
      note.blockId,
      text === null ? list.filter((h) => h.id !== note.id) : list.map((h) => (h.id === note.id ? { ...h, note: text.trim() || undefined } : h)),
    )
    setNote(null)
  }

  const canClear =
    menu && (menu.existing || menu.targets.some((t) => overlapsHighlight(highlights[t.blockId] ?? [], t.start, t.end)))

  return (
    <>
      {menu && (
        <div
          data-hl-menu
          role="menu"
          className="fixed z-50 flex overflow-hidden rounded border shadow-lg"
          style={{
            left: Math.max(8, Math.min(menu.x - 90, window.innerWidth - 200)),
            top: menu.y > 60 ? menu.y - 48 : menu.y + 24,
            background: 'var(--ex-bg)',
            borderColor: 'var(--ex-strong-border)',
          }}
          onPointerDown={(e) => e.preventDefault()}
        >
          {!menu.existing && <MenuButton icon={<Highlighter size={16} />} label="Highlight" onClick={() => apply('highlight')} />}
          <MenuButton icon={<StickyNote size={16} />} label="Notes" onClick={() => apply('note')} />
          {canClear && <MenuButton icon={<Eraser size={16} />} label="Clear" onClick={() => apply('clear')} />}
        </div>
      )}
      {note && <NoteEditor key={note.id} state={note} onSave={saveNote} onClose={() => setNote(null)} />}
    </>
  )
}

function MenuButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold hover:bg-[var(--ex-panel-2)]"
      style={{ color: 'var(--ex-fg)' }}
    >
      {icon}
      {label}
    </button>
  )
}

function NoteEditor({ state, onSave, onClose }: { state: NoteState; onSave: (text: string | null) => void; onClose: () => void }) {
  const [text, setText] = useState(state.text)
  return (
    <div
      data-hl-menu
      role="dialog"
      aria-label="Note"
      className="fixed z-50 w-72 rounded border p-3 shadow-xl"
      style={{
        left: Math.max(8, Math.min(state.x - 140, window.innerWidth - 300)),
        top: Math.min(state.y + 16, window.innerHeight - 200),
        background: 'var(--ex-bg)',
        borderColor: 'var(--ex-strong-border)',
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-bold">Note</span>
        <button type="button" onClick={onClose} aria-label="Close note" className="p-1">
          <X size={14} />
        </button>
      </div>
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        rows={4}
        className="exam-input w-full resize-none text-[14px]"
        placeholder="Type a note…"
      />
      <div className="mt-2 flex justify-between">
        <button type="button" onClick={() => onSave(null)} className="text-[13px] underline" style={{ color: 'var(--ex-wrong)' }}>
          Delete highlight
        </button>
        <button
          type="button"
          onClick={() => onSave(text)}
          className="rounded px-3 py-1 text-[13px] font-bold"
          style={{ background: 'var(--ex-accent)', color: 'var(--ex-accent-fg)' }}
        >
          Save
        </button>
      </div>
    </div>
  )
}
