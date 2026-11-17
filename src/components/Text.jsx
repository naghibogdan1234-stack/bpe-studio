import { Fragment } from 'react'
/* Bucăți de text animate, folosite de mai multe blocuri. */

/* Titlu care apare cuvânt cu cuvânt (clasa .sp din CSS) */
export function SplitHeading({ as: Tag = 'h2', text, className = 'h2 rv', id, style }) {
  const words = text.trim().split(/\s+/)
  return (
    <Tag id={id} className={className + ' sp'} aria-label={text} style={style}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true"><span style={{ '--k': i }}>{w}</span></span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

/* Text despărțit în litere (titlul mare de sus, logo-ul din subsol) */
export function Letters({ text, varName = '--k', offset = 0, className = 'ch' }) {
  return text.split('').map((c, i) => (
    <span key={i} className={className || undefined} aria-hidden="true" style={{ [varName]: i + offset }}>{c === ' ' ? ' ' : c}</span>
  ))
}
