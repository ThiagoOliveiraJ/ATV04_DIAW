import { spriteUrl } from '../api'
import { STATS, pad, typeColor } from '../constants'
import Modal from './Modal'
import StatBar from './StatBar'
import TypeBadge from './TypeBadge'

export default function PokemonDetails({ pokemon, trainers, onClose, onEdit, onDelete }) {
  const color = typeColor(pokemon.types[0])
  const owners = trainers.filter((t) => t.pokemonIds.includes(pokemon.id))
  const total = STATS.reduce((sum, s) => sum + pokemon[s.key], 0)

  return (
    <Modal onClose={onClose}>
      <div className="details-hero" style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}>
        <img src={spriteUrl(pokemon.id)} alt={pokemon.name} />
      </div>
      <div className="details-body">
        <span className="card-id">#{pad(pokemon.id)}</span>
        <h2>{pokemon.name}</h2>
        <div className="badges">
          {pokemon.types.map((t) => <TypeBadge key={t} type={t} />)}
        </div>

        <div className="stats">
          {STATS.map((s) => (
            <StatBar key={s.key} label={s.label} value={pokemon[s.key]} color={color} />
          ))}
          <div className="stat-total">Total: <strong>{total}</strong></div>
        </div>

        <h4>Treinadores</h4>
        {owners.length === 0
          ? <p className="muted">Nenhum treinador possui este Pokémon.</p>
          : <p>{owners.map((t) => t.name).join(', ')}</p>}

        <div className="actions">
          <button className="btn" onClick={() => onEdit(pokemon)}>✏️ Editar</button>
          <button className="btn btn-danger" onClick={() => onDelete(pokemon)}>🗑️ Excluir</button>
        </div>
      </div>
    </Modal>
  )
}
