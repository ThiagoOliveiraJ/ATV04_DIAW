package br.edu.pokedex.repository;

import br.edu.pokedex.model.PokemonType;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PokemonTypeRepository extends MongoRepository<PokemonType, Integer> {
}
