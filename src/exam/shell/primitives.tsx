import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

export function ExamDialog({
  title,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string
  onClose?: () => void
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[90vh] w-full ${wide ? 'max-w-2xl' : 'max-w-md'} flex flex-col overflow-hidden rounded border shadow-2xl outline-none`}
        style={{ background: 'var(--ex-bg)', color: 'var(--ex-fg)', borderColor: 'var(--ex-strong-border)' }}
      >
        <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: 'var(--ex-border)', background: 'var(--ex-panel)' }}>
          <h2 className="text-[1.05em] font-bold">{title}</h2>
          {onClose && (
            <button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 hover:bg-[var(--ex-panel-2)]">
              <X size={18} />
            </button>
          )}
        </div>
        <div className="exam-scroll px-5 py-4 leading-relaxed">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t px-5 py-3" style={{ borderColor: 'var(--ex-border)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function ExamButton({
  children,
  onClick,
  variant = 'primary',
  disabled,
  type = 'button',
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}) {
  const primary = variant === 'primary'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-[4px] border px-4 py-2 font-bold transition-opacity disabled:opacity-50 ${className}`}
      style={{
        background: primary ? 'var(--ex-accent)' : 'var(--ex-bg)',
        color: primary ? 'var(--ex-accent-fg)' : 'var(--ex-fg)',
        borderColor: primary ? 'var(--ex-accent)' : 'var(--ex-strong-border)',
      }}
    >
      {children}
    </button>
  )
}

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onDone, 6000)
    return () => window.clearTimeout(id)
  }, [message, onDone])
  return (
    <div
      role="status"
      aria-live="assertive"
      className="toast-in fixed top-16 left-1/2 z-[70] -translate-x-1/2 rounded border-2 px-5 py-2.5 font-bold shadow-lg"
      style={{ background: 'var(--ex-bg)', borderColor: '#d97706', color: 'var(--ex-fg)' }}
    >
      {message}
    </div>
  )
}
