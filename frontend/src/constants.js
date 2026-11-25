export const TYPE_COLORS = {
  Normal: '#a8a77a', Fire: '#ee8130', Water: '#6390f0', Grass: '#7ac74c',
  Electric: '#f7d02c', Ice: '#96d9d6', Fighting: '#c22e28', Poison: '#a33ea1',
  Ground: '#e2bf65', Flying: '#a98ff3', Psychic: '#f95587', Bug: '#a6b91a',
  Rock: '#b6a136', Ghost: '#735797', Dragon: '#6f35fc', Dark: '#705746',
  Steel: '#b7b7ce', Typeless: '#68a090',
}

export const typeColor = (t) => TYPE_COLORS[t] || '#777'

export const STATS = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Attack' },
  { key: 'defense', label: 'Defense' },
  { key: 'specialAttack', label: 'Sp. Atk' },
  { key: 'specialDefense', label: 'Sp. Def' },
  { key: 'speed', label: 'Speed' },
]

export const SORTS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nome' },
  ...STATS.map((s) => ({ key: s.key, label: s.label })),
]

export const pad = (id) => String(id).padStart(3, '0')
