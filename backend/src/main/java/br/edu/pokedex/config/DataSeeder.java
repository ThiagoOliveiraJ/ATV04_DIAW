package br.edu.pokedex.config;

import br.edu.pokedex.model.Pokemon;
import br.edu.pokedex.model.PokemonType;
import br.edu.pokedex.model.Trainer;
import br.edu.pokedex.repository.PokemonRepository;
import br.edu.pokedex.repository.PokemonTypeRepository;
import br.edu.pokedex.repository.TrainerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import java.io.InputStream;
import java.util.List;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = true)
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private final JsonMapper mapper = JsonMapper.builder().build();

    private final PokemonRepository pokemons;
    private final TrainerRepository trainers;
    private final PokemonTypeRepository types;

    public DataSeeder(PokemonRepository pokemons, TrainerRepository trainers, PokemonTypeRepository types) {
        this.pokemons = pokemons;
        this.trainers = trainers;
        this.types = types;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (pokemons.count() == 0) {
            pokemons.saveAll(read("seed/pokemons.json", new TypeReference<List<Pokemon>>() {}));
            log.info("Coleção 'pokemons' populada");
        }
        if (trainers.count() == 0) {
            trainers.saveAll(read("seed/trainers.json", new TypeReference<List<Trainer>>() {}));
            log.info("Coleção 'trainers' populada");
        }
        if (types.count() == 0) {
            types.saveAll(read("seed/types.json", new TypeReference<List<PokemonType>>() {}));
            log.info("Coleção 'types' populada");
        }
    }

    private <T> T read(String path, TypeReference<T> type) throws Exception {
        try (InputStream in = new ClassPathResource(path).getInputStream()) {
            return mapper.readValue(in, type);
        }
    }
}
