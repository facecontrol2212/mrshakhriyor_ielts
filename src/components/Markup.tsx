import { Fragment, type ReactNode } from 'react'
import { parseInline } from '@/lib/text'

interface Props {
  text: string
  /** Renders the answer gap for a question number; defaults to a blank line. */
  gap?: (n: number) => ReactNode
}

/** Renders inline markup: **bold**, *italic* and {{n}} answer gaps. */
export function Markup({ text, gap }: Props) {
  return (
    <>
      {parseInline(text).map((token, i) => {
        if (token.type === 'gap') return <Fragment key={i}>{gap ? gap(token.n) : '__________'}</Fragment>
        if (token.bold) return <strong key={i}>{token.text}</strong>
        if (token.italic) return <em key={i}>{token.text}</em>
        return <Fragment key={i}>{token.text}</Fragment>
      })}
    </>
  )
}
