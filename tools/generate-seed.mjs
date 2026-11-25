import { readFileSync, writeFileSync } from "node:fs";
const sql = readFileSync(new URL("../Script_Pokedex.sql", import.meta.url), "utf8");

function rows(table) {
  const m = sql.match(new RegExp("INSERT INTO " + table + String.raw`\s*\([^)]*\)\s*VALUES([\s\S]*?);`, "i"));
  if (!m) throw new Error("tabela não encontrada: " + table);
  return [...m[1].matchAll(/\(([^)]*)\)/g)].map((r) =>
    r[1].split(/,(?=(?:[^']*'[^']*')*[^']*$)/).map((v) => {
      v = v.trim();
      return v.startsWith("'") ? v.slice(1, -1) : Number(v);
    })
  );
}

const types = new Map(rows("Types").map(([id, name]) => [id, name]));
const typesOf = new Map(), pokeOf = new Map();
for (const [p, t] of rows("Rel_Pokemon_Type")) (typesOf.get(p) ?? typesOf.set(p, []).get(p)).push(types.get(t));
for (const [t, p] of rows("Rel_Trainer_Pokemon")) (pokeOf.get(t) ?? pokeOf.set(t, []).get(t)).push(p);

const pokemons = rows("Pokemon").map(([id, name, hp, attack, defense, specialAttack, specialDefense, speed]) => ({
  id, name, hp, attack, defense, specialAttack, specialDefense, speed, types: typesOf.get(id) ?? [],
}));
const trainers = rows("Trainers").map(([id, name, badges]) => ({ id, name, badges, pokemonIds: pokeOf.get(id) ?? [] }));

const out = new URL("../backend/src/main/resources/seed/", import.meta.url);
writeFileSync(new URL("pokemons.json", out), JSON.stringify(pokemons, null, 1));
writeFileSync(new URL("trainers.json", out), JSON.stringify(trainers, null, 1));
writeFileSync(new URL("types.json", out), JSON.stringify([...types].map(([id, name]) => ({ id, name })), null, 1));
console.log(pokemons.length, "pokemons,", trainers.length, "trainers,", types.size, "types");
