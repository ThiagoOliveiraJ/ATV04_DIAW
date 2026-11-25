package br.edu.pokedex.controller;

import br.edu.pokedex.exception.NotFoundException;
import br.edu.pokedex.model.PokemonType;
import br.edu.pokedex.model.Trainer;
import br.edu.pokedex.repository.PokemonTypeRepository;
import br.edu.pokedex.repository.TrainerRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LookupController {

    private final PokemonTypeRepository types;
    private final TrainerRepository trainers;

    public LookupController(PokemonTypeRepository types, TrainerRepository trainers) {
        this.types = types;
        this.trainers = trainers;
    }

    @GetMapping("/types")
    public List<PokemonType> types() {
        return types.findAll(Sort.by("id"));
    }

    @GetMapping("/trainers")
    public List<Trainer> trainers() {
        return trainers.findAll(Sort.by("id"));
    }

    @GetMapping("/trainers/{id}")
    public Trainer trainer(@PathVariable int id) {
        return trainers.findById(id).orElseThrow(() -> new NotFoundException("Treinador " + id + " não encontrado"));
    }
}
