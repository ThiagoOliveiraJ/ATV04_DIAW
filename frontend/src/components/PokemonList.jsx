import PokemonCard from './PokemonCard'

export default function PokemonList({ pokemons, favorites, compare, ...handlers }) {
  if (pokemons.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">🔍</div>
        <p>Nenhum Pokémon encontrado.</p>
        <small>Tente outro nome, ID ou tipo.</small>
      </div>
    )
  }
  return (
    <div className="grid">
      {pokemons.map((p) => (
        <PokemonCard
          key={p.id}
          pokemon={p}
          favorite={favorites.includes(p.id)}
          comparing={compare.some((c) => c.id === p.id)}
          onToggleFavorite={handlers.onToggleFavorite}
          onSelect={handlers.onSelect}
          onToggleCompare={handlers.onToggleCompare}
        />
      ))}
    </div>
  )
}
