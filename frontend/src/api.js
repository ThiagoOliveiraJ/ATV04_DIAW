const BASE = (import.meta.env.VITE_API_URL || '') + '/api'

async function request(path, options) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    let message = `Erro ${res.status}`
    try {
      const body = await res.json()
      message = body.message || message
      if (body.errors) message += ': ' + Object.values(body.errors).join(', ')
    } catch { message = `Erro ${res.status}` }
    throw new Error(message)
  }
  return res.status === 204 ? null : res.json()
}

export const api = {
  listPokemons: (params = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString()
    return request('/pokemons' + (q ? `?${q}` : ''))
  },
  getPokemon: (id) => request(`/pokemons/${id}`),
  createPokemon: (p) => request('/pokemons', { method: 'POST', body: JSON.stringify(p) }),
  updatePokemon: (id, p) => request(`/pokemons/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  deletePokemon: (id) => request(`/pokemons/${id}`, { method: 'DELETE' }),
  listTypes: () => request('/types'),
  listTrainers: () => request('/trainers'),
}

export const spriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
