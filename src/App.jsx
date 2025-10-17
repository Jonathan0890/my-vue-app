import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20; // pokemons por página

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      .then((res) => res.json())
      .then((data) => setPokemons(data.results));
  }, [offset]);

  const getPokemonImage = (url) => {
    const id = url.split("/")[6];
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const filteredPokemons = pokemons.filter((poke) =>
    poke.name.toLowerCase().includes(search.toLowerCase())
  );

  const nextPage = () => setOffset(offset + limit);
  const prevPage = () => setOffset(Math.max(0, offset - limit));

  return (
    <div className="container">
      <header>
        <h1>PokéPWA</h1>
        <input
          type="text"
          placeholder="🔍 Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <main className="pokedex">
        {filteredPokemons.map((poke, index) => (
          <div key={index} className="card">
            <img src={getPokemonImage(poke.url)} alt={poke.name} />
            <h2>{poke.name}</h2>
          </div>
        ))}
      </main>

      <div className="pagination">
        <button onClick={prevPage} disabled={offset === 0}>
          ⬅ Previous
        </button>
        <span>
          Page {offset / limit + 1}
        </span>
        <button onClick={nextPage}>Next ➡</button>
      </div>

    </div>
  );
}

export default App;
