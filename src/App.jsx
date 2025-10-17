import React, { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      .then(res => res.json())
      .then(data => setPokemons(data.results));
  }, [offset]);

  const getPokemonImage = (url) => {
    const id = url.split("/")[6];
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const filteredPokemons = pokemons.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const nextPage = () => setOffset(offset + limit);
  const prevPage = () => setOffset(Math.max(0, offset - limit));

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 flex flex-col items-center p-4">
      {/* HEADER */}
      <header className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-red-600 drop-shadow-md mb-4">
          PokéPWA
        </h1>
        <input
          type="text"
          placeholder="🔍 Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 sm:w-80 px-4 py-2 rounded-full border-2 border-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        />
      </header>

      {/* POKEDEX GRID */}
      <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 w-full max-w-6xl">
        {filteredPokemons.map((poke, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center transform hover:scale-105 transition">
            <img
              src={getPokemonImage(poke.url)}
              alt={poke.name}
              className="w-20 h-20 sm:w-28 sm:h-28 object-contain mb-2 transition-transform hover:rotate-[-5deg] hover:scale-105"
            />
            <h2 className="capitalize text-gray-800 text-sm sm:text-base text-center">{poke.name}</h2>
          </div>
        ))}
      </main>

      {/* PAGINATION */}
      <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
        <button
          onClick={prevPage}
          disabled={offset === 0}
          className="px-4 py-2 bg-red-600 text-white rounded-md disabled:bg-gray-300 transition"
        >
          ⬅ Previous
        </button>
        <span className="text-gray-700 font-medium">Page {offset / limit + 1}</span>
        <button
          onClick={nextPage}
          className="px-4 py-2 bg-red-600 text-white rounded-md transition"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

export default App;
