package br.edu.pokedex.service;

import br.edu.pokedex.exception.NotFoundException;
import br.edu.pokedex.model.Pokemon;
import br.edu.pokedex.repository.PokemonRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class PokemonService {

    private final PokemonRepository repository;

    public PokemonService(PokemonRepository repository) {
        this.repository = repository;
    }

    public List<Pokemon> findAll(String name, String type) {
        boolean hasName = name != null && !name.isBlank();
        boolean hasType = type != null && !type.isBlank();
        List<Pokemon> result;
        if (hasName && hasType) result = repository.findByNameContainingIgnoreCaseAndTypesIgnoreCase(name.trim(), type.trim());
        else if (hasName) result = repository.findByNameContainingIgnoreCase(name.trim());
        else if (hasType) result = repository.findByTypesIgnoreCase(type.trim());
        else return repository.findAll(Sort.by("id"));
        return result.stream().sorted(Comparator.comparing(Pokemon::getId)).toList();
    }

    public Pokemon findById(int id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Pokémon " + id + " não encontrado"));
    }

    public Pokemon create(Pokemon pokemon) {
        if (pokemon.getId() == null) {
            int next = repository.findAll(Sort.by(Sort.Direction.DESC, "id")).stream()
                    .findFirst().map(p -> p.getId() + 1).orElse(1);
            pokemon.setId(next);
        } else if (repository.existsById(pokemon.getId())) {
            throw new IllegalStateException("Já existe um Pokémon com o ID " + pokemon.getId());
        }
        return repository.save(pokemon);
    }

    public Pokemon update(int id, Pokemon pokemon) {
        if (!repository.existsById(id)) throw new NotFoundException("Pokémon " + id + " não encontrado");
        pokemon.setId(id);
        return repository.save(pokemon);
    }

    public void delete(int id) {
        if (!repository.existsById(id)) throw new NotFoundException("Pokémon " + id + " não encontrado");
        repository.deleteById(id);
    }
}
