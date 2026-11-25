package br.edu.pokedex.repository;

import br.edu.pokedex.model.Pokemon;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PokemonRepository extends MongoRepository<Pokemon, Integer> {
    List<Pokemon> findByNameContainingIgnoreCase(String name);
    List<Pokemon> findByTypesIgnoreCase(String type);
    List<Pokemon> findByNameContainingIgnoreCaseAndTypesIgnoreCase(String name, String type);
}
