import { spriteUrl } from '../api'
import { STATS } from '../constants'
import Modal from './Modal'

export default function CompareModal({ pair, onClose }) {
  const [a, b] = pair
  return (
    <Modal onClose={onClose} wide>
      <h2>⚔️ Comparação</h2>
      <div className="compare-head">
        {[a, b].map((p) => (
          <div key={p.id}>
            <img src={spriteUrl(p.id)} alt={p.name} />
            <h3>{p.name}</h3>
          </div>
        ))}
      </div>
      <table className="compare">
        <tbody>
          {STATS.map((s) => (
            <tr key={s.key}>
              <td className={a[s.key] > b[s.key] ? 'win' : ''}>{a[s.key]}</td>
              <th>{s.label}</th>
              <td className={b[s.key] > a[s.key] ? 'win' : ''}>{b[s.key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  )
}
