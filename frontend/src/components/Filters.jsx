import { typeColor, SORTS } from '../constants'

export default function Filters({ types, selected, onSelect, sort, onSort, desc, onToggleDesc, onRandom, favoritesOnly, onToggleFavorites }) {
  return (
    <div className="filters">
      <div className="type-filters">
        <button className={`chip ${selected === '' ? 'active' : ''}`} onClick={() => onSelect('')}>
          Todos
        </button>
        {types.map((t) => (
          <button
            key={t}
            className={`chip ${selected === t ? 'active' : ''}`}
            style={{ '--chip': typeColor(t) }}
            onClick={() => onSelect(selected === t ? '' : t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="tools">
        <label>
          Ordenar por{' '}
          <select value={sort} onChange={(e) => onSort(e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </label>
        <button className="btn" onClick={onToggleDesc} title="Inverter ordem">{desc ? '↓ Desc' : '↑ Asc'}</button>
        <button className={`btn ${favoritesOnly ? 'btn-primary' : ''}`} onClick={onToggleFavorites}>★ Favoritos</button>
        <button className="btn" onClick={onRandom}>🎲 Aleatório</button>
      </div>
    </div>
  )
}
