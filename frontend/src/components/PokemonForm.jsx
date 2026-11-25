import { useState } from 'react'
import { STATS } from '../constants'
import Modal from './Modal'

const EMPTY = { name: '', hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50, types: [] }

export default function PokemonForm({ pokemon, types, onSave, onClose }) {
  const editing = Boolean(pokemon)
  const [form, setForm] = useState(pokemon ?? EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const toggleType = (t) =>
    set('types', form.types.includes(t) ? form.types.filter((x) => x !== t) : [...form.types, t])

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) return setError('Informe o nome.')
    if (form.types.length === 0) return setError('Selecione ao menos um tipo.')
    setSaving(true)
    setError('')
    try {
      await onSave({ ...form, name: form.name.trim() })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <Modal onClose={onClose} wide>
      <form className="form" onSubmit={submit}>
        <h2>{editing ? `Editar ${pokemon.name} (#${pokemon.id})` : 'Cadastrar Pokémon'}</h2>

        <label>
          Nome
          <input value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={30} autoFocus />
        </label>

        <div className="form-stats">
          {STATS.map((s) => (
            <label key={s.key}>
              {s.label}
              <input
                type="number" min="1" max="255"
                value={form[s.key]}
                onChange={(e) => set(s.key, Number(e.target.value))}
              />
            </label>
          ))}
        </div>

        <fieldset>
          <legend>Tipos</legend>
          <div className="type-picker">
            {types.map((t) => (
              <label key={t} className={`pick ${form.types.includes(t) ? 'on' : ''}`}>
                <input type="checkbox" checked={form.types.includes(t)} onChange={() => toggleType(t)} />
                {t}
              </label>
            ))}
          </div>
        </fieldset>

        {error && <p className="error">{error}</p>}
        <div className="actions">
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
