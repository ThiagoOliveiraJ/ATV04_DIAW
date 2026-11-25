import { spriteUrl } from '../api'
import { pad, typeColor } from '../constants'
import TypeBadge from './TypeBadge'

export default function PokemonCard({ pokemon, favorite, onToggleFavorite, onSelect, comparing, onToggleCompare }) {
  const color = typeColor(pokemon.types[0])
  return (
    <article
      className={`card ${comparing ? 'comparing' : ''}`}
      style={{ '--accent': color }}
      onClick={() => onSelect(pokemon)}
    >
      <div className="card-top">
        <span className="card-id">#{pad(pokemon.id)}</span>
        <button
          className={`icon-btn ${favorite ? 'on' : ''}`}
          title="Favoritar"
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(pokemon.id) }}
        >
          {favorite ? '★' : '☆'}
        </button>
      </div>
      <img
        src={spriteUrl(pokemon.id)}
        alt={pokemon.name}
        loading="lazy"
        onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
      />
      <h3>{pokemon.name}</h3>
      <div className="badges">
        {pokemon.types.map((t) => <TypeBadge key={t} type={t} />)}
      </div>
      <div className="mini-stats">
        <span>❤️ {pokemon.hp}</span>
        <span>⚔️ {pokemon.attack}</span>
        <span>🛡️ {pokemon.defense}</span>
        <span>✨ {pokemon.specialAttack}</span>
        <span>🔰 {pokemon.specialDefense}</span>
        <span>💨 {pokemon.speed}</span>
      </div>
      <button
        className={`btn btn-small ${comparing ? 'btn-primary' : ''}`}
        onClick={(e) => { e.stopPropagation(); onToggleCompare(pokemon) }}
      >
        ⚔️ {comparing ? 'Selecionado' : 'Comparar'}
      </button>
    </article>
  )
}
