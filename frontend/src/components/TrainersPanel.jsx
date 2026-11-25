import { spriteUrl } from '../api'
import Modal from './Modal'

export default function TrainersPanel({ trainers, pokemons, onClose, onSelect }) {
  const byId = new Map(pokemons.map((p) => [p.id, p]))
  return (
    <Modal onClose={onClose} wide>
      <h2>🧑‍🚀 Treinadores</h2>
      <div className="trainers">
        {trainers.map((t) => (
          <section key={t.id} className="trainer">
            <header>
              <h3>{t.name}</h3>
              <span className="badges-count">🏅 {t.badges} insígnia{t.badges === 1 ? '' : 's'}</span>
            </header>
            <div className="trainer-team">
              {t.pokemonIds.length === 0 && <span className="muted">Sem Pokémon</span>}
              {t.pokemonIds.map((id) => {
                const p = byId.get(id)
                return (
                  <button
                    key={id}
                    className="team-member"
                    title={p ? p.name : `#${id} (removido)`}
                    disabled={!p}
                    onClick={() => p && onSelect(p)}
                  >
                    <img src={spriteUrl(id)} alt={p ? p.name : `#${id}`} loading="lazy" />
                    <span>{p ? p.name : `#${id}`}</span>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </Modal>
  )
}
