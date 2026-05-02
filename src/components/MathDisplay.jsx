import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

export default function MathDisplay({ latex, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current && latex) {
      katex.render(latex, ref.current, { throwOnError: false })
    }
  }, [latex])
  if (!latex) return null
  return <span ref={ref} className={className} />
}
