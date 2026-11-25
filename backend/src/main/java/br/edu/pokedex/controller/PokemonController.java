package br.edu.pokedex.controller;

import br.edu.pokedex.model.Pokemon;
import br.edu.pokedex.service.PokemonService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pokemons")
public class PokemonController {

    private final PokemonService service;

    public PokemonController(PokemonService service) {
        this.service = service;
    }

    @GetMapping
    public List<Pokemon> list(@RequestParam(required = false) String name,
                              @RequestParam(required = false) String type) {
        return service.findAll(name, type);
    }

    @GetMapping("/{id}")
    public Pokemon get(@PathVariable int id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Pokemon create(@Valid @RequestBody Pokemon pokemon) {
        return service.create(pokemon);
    }

    @PutMapping("/{id}")
    public Pokemon update(@PathVariable int id, @Valid @RequestBody Pokemon pokemon) {
        return service.update(id, pokemon);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable int id) {
        service.delete(id);
    }
}
