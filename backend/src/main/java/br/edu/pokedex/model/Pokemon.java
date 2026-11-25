package br.edu.pokedex.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "pokemons")
public class Pokemon {

    @Id
    private Integer id;

    @NotBlank(message = "O nome é obrigatório")
    private String name;

    @Min(1) @Max(255) private int hp;
    @Min(1) @Max(255) private int attack;
    @Min(1) @Max(255) private int defense;
    @Min(1) @Max(255) private int specialAttack;
    @Min(1) @Max(255) private int specialDefense;
    @Min(1) @Max(255) private int speed;

    @NotEmpty(message = "Informe ao menos um tipo")
    private List<String> types = new ArrayList<>();

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getHp() { return hp; }
    public void setHp(int hp) { this.hp = hp; }
    public int getAttack() { return attack; }
    public void setAttack(int attack) { this.attack = attack; }
    public int getDefense() { return defense; }
    public void setDefense(int defense) { this.defense = defense; }
    public int getSpecialAttack() { return specialAttack; }
    public void setSpecialAttack(int specialAttack) { this.specialAttack = specialAttack; }
    public int getSpecialDefense() { return specialDefense; }
    public void setSpecialDefense(int specialDefense) { this.specialDefense = specialDefense; }
    public int getSpeed() { return speed; }
    public void setSpeed(int speed) { this.speed = speed; }
    public List<String> getTypes() { return types; }
    public void setTypes(List<String> types) { this.types = types; }
}
