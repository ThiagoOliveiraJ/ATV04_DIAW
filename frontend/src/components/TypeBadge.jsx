import { typeColor } from '../constants'

export default function TypeBadge({ type }) {
  return (
    <span className="type-badge" style={{ background: typeColor(type) }}>
      {type}
    </span>
  )
}
