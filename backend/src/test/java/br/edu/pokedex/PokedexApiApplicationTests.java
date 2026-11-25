package br.edu.pokedex;

import br.edu.pokedex.exception.NotFoundException;
import br.edu.pokedex.model.Pokemon;
import br.edu.pokedex.repository.PokemonRepository;
import br.edu.pokedex.service.PokemonService;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PokedexApiApplicationTests {

    private final Map<Integer, Pokemon> store = new TreeMap<>();

    @SuppressWarnings("unchecked")
    private final PokemonRepository repo = (PokemonRepository) Proxy.newProxyInstance(
            getClass().getClassLoader(), new Class<?>[]{PokemonRepository.class}, (proxy, m, args) -> switch (m.getName()) {
                case "findAll" -> {
                    List<Pokemon> all = new ArrayList<>(store.values());
                    all.sort(args != null && args.length > 0 && args[0].toString().contains("DESC")
                            ? Comparator.comparing(Pokemon::getId).reversed() : Comparator.comparing(Pokemon::getId));
                    yield all;
                }
                case "findById" -> Optional.ofNullable(store.get((Integer) args[0]));
                case "existsById" -> store.containsKey((Integer) args[0]);
                case "save" -> { Pokemon p = (Pokemon) args[0]; store.put(p.getId(), p); yield p; }
                case "deleteById" -> { store.remove((Integer) args[0]); yield null; }
                default -> throw new UnsupportedOperationException(m.getName());
            });

    private final PokemonService service = new PokemonService(repo);

    private Pokemon pokemon(Integer id) {
        Pokemon p = new Pokemon();
        p.setId(id);
        p.setName("Teste");
        p.setTypes(List.of("Fire"));
        return p;
    }

    @Test
    void createAssignsNextId() {
        store.put(151, pokemon(151));
        assertEquals(152, service.create(pokemon(null)).getId());
    }

    @Test
    void createWithExistingIdConflicts() {
        store.put(25, pokemon(25));
        assertThrows(IllegalStateException.class, () -> service.create(pokemon(25)));
    }

    @Test
    void findMissingThrows() {
        assertThrows(NotFoundException.class, () -> service.findById(999));
    }

    @Test
    void updateAndDelete() {
        store.put(1, pokemon(1));
        Pokemon changed = pokemon(null);
        changed.setName("Novo");
        assertEquals("Novo", service.update(1, changed).getName());
        service.delete(1);
        assertThrows(NotFoundException.class, () -> service.delete(1));
    }
}
