import { GripVertical } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'

/**
 * Passage | questions layout with a draggable divider. On narrow screens the
 * two panes become tabs so the test is still usable on a phone.
 */
export function SplitPane({ left, right, leftLabel, rightLabel }: { left: ReactNode; right: ReactNode; leftLabel: string; rightLabel: string }) {
  const [ratio, setRatio] = useState(0.5)
  const [tab, setTab] = useState<'left' | 'right'>('left')
  const ref = useRef<HTMLDivElement>(null)

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    target.setPointerCapture(event.pointerId)
    const move = (e: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      setRatio(Math.min(0.75, Math.max(0.25, (e.clientX - rect.left) / rect.width)))
    }
    const up = () => {
      target.removeEventListener('pointermove', move)
      target.removeEventListener('pointerup', up)
    }
    target.addEventListener('pointermove', move)
    target.addEventListener('pointerup', up)
  }

  const tabButton = (value: 'left' | 'right', label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === value}
      onClick={() => setTab(value)}
      className="flex-1 border-b-2 py-2.5 text-[14px] font-bold"
      style={{ borderColor: tab === value ? 'var(--ex-accent)' : 'transparent', color: tab === value ? 'var(--ex-fg)' : 'var(--ex-muted)' }}
    >
      {label}
    </button>
  )

  return (
    <div ref={ref} className="flex h-full min-h-0 flex-col lg:flex-row">
      <div role="tablist" className="flex shrink-0 border-b lg:hidden" style={{ borderColor: 'var(--ex-border)' }}>
        {tabButton('left', leftLabel)}
        {tabButton('right', rightLabel)}
      </div>
      <div
        role="region"
        aria-label={leftLabel}
        tabIndex={0}
        className={`exam-scroll min-h-0 flex-1 lg:block lg:flex-none ${tab === 'left' ? 'block' : 'hidden'}`}
        style={{ flexBasis: `${ratio * 100}%` }}
        data-pane="left"
      >
        {left}
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize passage and questions"
        aria-valuenow={Math.round(ratio * 100)}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setRatio((r) => Math.max(0.25, r - 0.05))
          if (e.key === 'ArrowRight') setRatio((r) => Math.min(0.75, r + 0.05))
        }}
        className="hidden w-3 shrink-0 cursor-col-resize touch-none items-center justify-center border-x lg:flex"
        style={{ borderColor: 'var(--ex-border)', background: 'var(--ex-panel)' }}
      >
        <GripVertical size={14} aria-hidden style={{ color: 'var(--ex-muted)' }} />
      </div>
      <div role="region" aria-label={rightLabel} tabIndex={0} className={`exam-scroll min-h-0 flex-1 lg:block ${tab === 'right' ? 'block' : 'hidden'}`} data-pane="right">
        {right}
      </div>
    </div>
  )
}
