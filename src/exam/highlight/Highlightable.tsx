import { Fragment, useMemo, type ReactNode } from 'react'
import { findSpans, segmentBoundaries, type Span } from '@/lib/highlights'
import { parseInline } from '@/lib/text'
import { useExam } from '../ExamContext'

interface Props {
  /** Unique id of this block of text; highlights are stored against it. */
  blockId: string
  text: string
  as?: 'p' | 'span' | 'div' | 'h2' | 'h3'
  className?: string
  /** Quotes to mark as answer evidence, with their question numbers (review screen only). */
  evidence?: { quote: string; n: number }[]
}

type Run = Span & { bold?: boolean; italic?: boolean }

/**
 * Text that candidates can highlight and annotate. Offsets are counted over
 * the visible text, so nothing but text may be rendered inside the block.
 */
export function Highlightable({ blockId, text, as: Tag = 'span', className, evidence }: Props) {
  const { highlights } = useExam()
  const list = highlights[blockId]

  const { plain, runs } = useMemo(() => {
    let offset = 0
    const out: Run[] = []
    let joined = ''
    for (const token of parseInline(text)) {
      if (token.type !== 'text') continue
      out.push({ start: offset, end: offset + token.text.length, bold: token.bold, italic: token.italic })
      joined += token.text
      offset += token.text.length
    }
    return { plain: joined, runs: out }
  }, [text])

  const evidenceSpans = useMemo(
    () => (evidence ?? []).flatMap(({ quote, n }) => findSpans(plain, quote).map((span) => ({ ...span, n }))),
    [plain, evidence],
  )

  const pieces = segmentBoundaries(plain.length, [runs, list ?? [], evidenceSpans])

  return (
    <Tag data-hl-block={blockId} className={className}>
      {pieces.map((piece) => {
        const run = runs.find((r) => r.start <= piece.start && piece.end <= r.end)
        let node: ReactNode = plain.slice(piece.start, piece.end)
        if (run?.bold) node = <strong>{node}</strong>
        if (run?.italic) node = <em>{node}</em>
        const ev = evidenceSpans.find((e) => e.start <= piece.start && piece.end <= e.end)
        if (ev) {
          // Extra text is safe here: evidence only appears in the read-only review screen.
          node = (
            <mark className="evidence">
              {node}
              {piece.end === ev.end && <sup className="ml-0.5 font-bold" style={{ color: 'var(--ex-correct)' }}>{ev.n}</sup>}
            </mark>
          )
        }
        const highlight = list?.find((h) => h.start <= piece.start && piece.end <= h.end)
        if (highlight)
          node = (
            <mark className={highlight.note ? 'hl-note' : 'hl'} data-hl-id={highlight.id} title={highlight.note || undefined}>
              {node}
            </mark>
          )
        return <Fragment key={piece.start}>{node}</Fragment>
      })}
    </Tag>
  )
}
