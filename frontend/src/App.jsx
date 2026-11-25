import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from './api'
import CompareModal from './components/CompareModal'
import Filters from './components/Filters'
import PokemonDetails from './components/PokemonDetails'
import PokemonForm from './components/PokemonForm'
import PokemonList from './components/PokemonList'
import SearchBar from './components/SearchBar'
import TrainersPanel from './components/TrainersPanel'

function usePersisted(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initial
    } catch { return initial }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { return }
  }, [key, value])
  return [value, setValue]
}

export default function App() {
  const [pokemons, setPokemons] = useState([])
  const [types, setTypes] = useState([])
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [sort, setSort] = useState('id')
  const [desc, setDesc] = useState(false)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = usePersisted('pokedex:favorites', [])
  const [theme, setTheme] = usePersisted('pokedex:theme', 'light')

  const [selected, setSelected] = useState(null)
  const [formTarget, setFormTarget] = useState(undefined)
  const [showTrainers, setShowTrainers] = useState(false)
  const [compare, setCompare] = useState([])
  const [showCompare, setShowCompare] = useState(false)

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [p, t, tr] = await Promise.all([api.listPokemons(), api.listTypes(), api.listTrainers()])
      setPokemons(p)
      setTypes(t.map((x) => x.name))
      setTrainers(tr)
    } catch (e) {
      setError(`Não foi possível carregar os dados da API (${e.message}). O backend está rodando?`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(id)
  }, [toast])

  const usedTypes = useMemo(
    () => types.filter((t) => pokemons.some((p) => p.types.includes(t))),
    [types, pokemons],
  )

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^#/, '')
    const list = pokemons.filter((p) =>
      (!q || p.name.toLowerCase().includes(q) || String(p.id) === q || String(p.id).padStart(3, '0').includes(q)) &&
      (!typeFilter || p.types.includes(typeFilter)) &&
      (!favoritesOnly || favorites.includes(p.id)))
    const dir = desc ? -1 : 1
    return list.sort((a, b) =>
      (sort === 'name' ? a.name.localeCompare(b.name) : a[sort] - b[sort]) * dir)
  }, [pokemons, query, typeFilter, favoritesOnly, favorites, sort, desc])

  const toggleFavorite = (id) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))

  const toggleCompare = (p) =>
    setCompare((c) => (c.some((x) => x.id === p.id) ? c.filter((x) => x.id !== p.id) : [...c.slice(-1), p]))

  const random = () => {
    if (visible.length) setSelected(visible[Math.floor(Math.random() * visible.length)])
  }

  async function save(data) {
    const saved = formTarget
      ? await api.updatePokemon(formTarget.id, data)
      : await api.createPokemon(data)
    setPokemons((list) =>
      (formTarget ? list.map((p) => (p.id === saved.id ? saved : p)) : [...list, saved]))
    setFormTarget(undefined)
    setSelected(null)
    setToast(formTarget ? `${saved.name} atualizado!` : `${saved.name} cadastrado!`)
  }

  async function remove(p) {
    if (!window.confirm(`Excluir ${p.name}?`)) return
    try {
      await api.deletePokemon(p.id)
      setPokemons((list) => list.filter((x) => x.id !== p.id))
      setCompare((c) => c.filter((x) => x.id !== p.id))
      setSelected(null)
      setToast(`${p.name} excluído.`)
    } catch (e) {
      setToast(`Erro ao excluir: ${e.message}`)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1><span className="pokeball" /> Pokédex</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setFormTarget(null)}>➕ Novo Pokémon</button>
          <button className="btn" onClick={() => setShowTrainers(true)}>🧑‍🚀 Treinadores</button>
          <button className="btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
          </button>
        </div>
      </header>

      <main>
        <SearchBar value={query} onChange={setQuery} />
        <Filters
          types={usedTypes} selected={typeFilter} onSelect={setTypeFilter}
          sort={sort} onSort={setSort} desc={desc} onToggleDesc={() => setDesc((d) => !d)}
          onRandom={random}
          favoritesOnly={favoritesOnly} onToggleFavorites={() => setFavoritesOnly((f) => !f)}
        />

        {loading && <p className="status">Carregando Pokémon…</p>}
        {error && (
          <div className="status error">
            <p>{error}</p>
            <button className="btn" onClick={load}>Tentar novamente</button>
          </div>
        )}
        {!loading && !error && (
          <>
            <p className="count">{visible.length} de {pokemons.length} Pokémon</p>
            <PokemonList
              pokemons={visible} favorites={favorites} compare={compare}
              onToggleFavorite={toggleFavorite} onSelect={setSelected} onToggleCompare={toggleCompare}
            />
          </>
        )}
      </main>

      {compare.length === 2 && (
        <div className="compare-bar">
          Comparar {compare[0].name} × {compare[1].name}
          <button className="btn btn-primary" onClick={() => setShowCompare(true)}>Ver comparação</button>
          <button className="btn" onClick={() => setCompare([])}>Limpar</button>
        </div>
      )}

      {selected && (
        <PokemonDetails
          pokemon={selected} trainers={trainers} onClose={() => setSelected(null)}
          onEdit={(p) => setFormTarget(p)} onDelete={remove}
        />
      )}
      {formTarget !== undefined && (
        <PokemonForm
          pokemon={formTarget} types={types.filter((t) => t !== 'Typeless')}
          onSave={save} onClose={() => setFormTarget(undefined)}
        />
      )}
      {showTrainers && (
        <TrainersPanel
          trainers={trainers} pokemons={pokemons}
          onClose={() => setShowTrainers(false)}
          onSelect={(p) => { setShowTrainers(false); setSelected(p) }}
        />
      )}
      {showCompare && compare.length === 2 && (
        <CompareModal pair={compare} onClose={() => setShowCompare(false)} />
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
