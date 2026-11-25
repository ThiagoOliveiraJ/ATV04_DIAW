# Pokédex Full Stack — React + Spring Boot + MongoDB

Atividade 04 (DIAW): a Pokédex da Atividade 03 (React + Vite) agora consome uma **API REST em Spring Boot** que persiste os dados em **MongoDB**.

```
Script_Pokedex.sql → MongoDB → Spring Boot REST API → React + Vite
```

## Estrutura

```
├── frontend/              React + Vite (Pokédex)
├── backend/               Spring Boot 4 (Web + Data MongoDB + Validation)
│   └── src/main/java/br/edu/pokedex/{controller,service,repository,model,config,exception}
├── tools/generate-seed.mjs  Converte Script_Pokedex.sql em JSON para o MongoDB
├── Script_Pokedex.sql     Fonte dos dados
└── README.md
```

## Pré-requisitos

- JDK 21+ (testado com JDK 25) — o Maven é fornecido pelo wrapper (`mvnw`)
- Node.js 20+
- Uma instância MongoDB (**MongoDB Atlas** recomendado, ou MongoDB local)

## 1. Configurar o MongoDB

### Opção A — MongoDB Atlas (recomendado)
1. Crie um cluster gratuito em <https://www.mongodb.com/atlas>.
2. Em *Database Access*, crie um usuário e senha. Em *Network Access*, libere seu IP.
3. Em *Connect → Drivers*, copie a connection string.
4. Crie o arquivo `backend/.env` (ele **não é versionado**; veja `backend/.env.example`):

```properties
MONGODB_URI=mongodb+srv://USUARIO:SENHA@CLUSTER.mongodb.net/pokedex?retryWrites=true&w=majority
```

Alternativa: defina a variável de ambiente `MONGODB_URI`.

### Opção B — MongoDB local
Sem configurar nada, a API usa `mongodb://localhost:27017/pokedex`.

### Carga dos dados
Na primeira execução, o backend popula as coleções vazias `pokemons` (151), `trainers` (12) e `types` (18) com os dados do `Script_Pokedex.sql`. Reiniciar a aplicação não duplica nada.
Os JSON em `backend/src/main/resources/seed/` são gerados do SQL por:

```bash
node tools/generate-seed.mjs
```

### Modelo de documentos

```json
// pokemons
{ "_id": 25, "name": "Pikachu", "hp": 35, "attack": 55, "defense": 30,
  "specialAttack": 50, "specialDefense": 40, "speed": 90, "types": ["Electric"] }
// trainers
{ "_id": 1, "name": "Ash", "badges": 9, "pokemonIds": [25, 3, 6, 9, 131, 143] }
// types
{ "_id": 5, "name": "Electric" }
```

## 2. Executar o backend (porta 8080)

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
./mvnw test                   # testes
```

## 3. Executar o frontend (porta 5173)

```bash
cd frontend
npm install
npm run dev
```

Acesse <http://localhost:5173>. Em desenvolvimento, o Vite encaminha `/api` para `http://localhost:8080`. Para outro backend, use `VITE_API_URL` (build) ou `VITE_API_PROXY` (dev).

## API REST

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| GET | `/api/pokemons` | Lista todos (filtros opcionais `?name=pika&type=Electric`) |
| GET | `/api/pokemons/{id}` | Busca por ID (404 se não existir) |
| POST | `/api/pokemons` | Cadastra (ID automático se omitido; 409 se já existir) |
| PUT | `/api/pokemons/{id}` | Atualiza |
| DELETE | `/api/pokemons/{id}` | Remove (204) |
| GET | `/api/types` | Lista tipos |
| GET | `/api/trainers`, `/api/trainers/{id}` | Treinadores e seus Pokémon |

Exemplo:

```bash
curl -X POST http://localhost:8080/api/pokemons -H "Content-Type: application/json" \
  -d '{"name":"Teste","hp":50,"attack":50,"defense":50,"specialAttack":50,"specialDefense":50,"speed":50,"types":["Fire"]}'
```

## Funcionalidades do frontend

- Listagem vinda da API, pesquisa por nome/ID enquanto digita, filtro por tipo, mensagem quando nada é encontrado
- Detalhes em modal com barras de atributos e treinadores do Pokémon
- **Cadastrar, editar e excluir** Pokémon (via API → MongoDB)
- Treinadores com insígnias e Pokémon
- Extras: favoritos, comparação de dois Pokémon, ordenação, Pokémon aleatório, modo escuro, layout responsivo

## Imagens

As imagens usam os *official artwork* do repositório público [PokeAPI/sprites](https://github.com/PokeAPI/sprites) (por ID do Pokémon). Direitos das imagens pertencem a Nintendo/Game Freak/The Pokémon Company; uso apenas educacional.

## Segurança

Credenciais do MongoDB ficam apenas em `backend/.env` / variáveis de ambiente (ignorados pelo Git).
