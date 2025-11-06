import React, { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const limit = 20;

  useEffect(() => {
    if (Notification.permission === "granted") {
      setNotificationEnabled(true);
    }
  }, []);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      .then((res) => res.json())
      .then((data) => setPokemons(data.results));
  }, [offset]);

  const getPokemonImage = (url) => {
    const id = url.split("/")[6];
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const handleSelect = (pokemon) => {
    fetch(pokemon.url)
      .then((res) => res.json())
      .then((data) => {
        setSelected(data);
        sendNotification(data.name, data.sprites.front_default);
      });
  };

  // 🔹 Enviar notificación local
const sendNotification = (name, icon) => {
  if (Notification.permission === "granted") {
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) {
        reg.showNotification(`¡Pokémon Encontrado!`, {
          body: `Has consultado a ${name.toUpperCase()} en tu Pokédex.`,
          icon: icon || "Pokeball-192.png", // Cambiado aquí
          badge: "pokeball.png", // Cambiado aquí
          vibrate: [200, 100, 200],
          tag: "pokemon-search",
          actions: [
            {
              action: "close",
              title: "Cerrar"
            }
          ]
        });
      } else {

        new Notification(`¡Pokémon Encontrado!`, {
          body: `Has consultado a ${name.toUpperCase()} en tu Pokédex.`,
          icon: icon || "Pokeball-192.png", // Cambiado aquí
        });
      }
    });
  }
};

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationEnabled(true);
        // Notificación de confirmación
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            reg.showNotification("¡Notificaciones Activadas!", {
              body: "Ahora recibirás notificaciones cuando consultes Pokémon.",
              icon: "/pwa-192x192.png",
              badge: "/pwa-64x64.png"
            });
          }
        });
      }
    } catch (error) {
      console.error("Error al solicitar permisos:", error);
    }
  };

  const filteredPokemons = pokemons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const nextPage = () => setOffset(offset + limit);
  const prevPage = () => setOffset(Math.max(0, offset - limit));

  // Colores por tipo de Pokémon
  const typeColors = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-cyan-300",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-amber-600",
    flying: "bg-indigo-300",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-amber-800",
    ghost: "bg-purple-700",
    dragon: "bg-violet-600",
    dark: "bg-gray-800",
    steel: "bg-gray-500",
    fairy: "bg-pink-300"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-400 to-orange-400 flex flex-col items-center p-4">
      <header className="text-center mb-8 w-full max-w-6xl">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/20">
          <h1 className="text-5xl sm:text-6xl font-bold text-red-600 drop-shadow-lg mb-4 font-pokemon tracking-wider">
            PokéPWA
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="🔍 Buscar Pokémon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-3 rounded-full border-2 border-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 focus:border-red-600 transition-all text-gray-800 placeholder-gray-500 text-lg shadow-lg"
              />
            </div>
            
            <button
              onClick={requestPermission}
              disabled={notificationEnabled}
              className={`px-6 py-3 rounded-full font-semibold text-white transition-all shadow-lg ${
                notificationEnabled 
                  ? "bg-green-500 cursor-not-allowed" 
                  : "bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95"
              }`}
            >
              {notificationEnabled ? "✅ Activadas" : "🔔 Activar Notificaciones"}
            </button>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 w-full max-w-7xl mb-8">
        {filteredPokemons.map((poke, index) => (
          <div
            key={index}
            onClick={() => handleSelect(poke)}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 flex flex-col items-center transform hover:scale-105 hover:rotate-1 transition-all duration-300 cursor-pointer border-2 border-white/30 hover:border-red-300 hover:shadow-2xl group"
          >
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-2 mb-3 shadow-inner group-hover:from-red-100 group-hover:to-orange-100 transition-all">
              <img
                src={getPokemonImage(poke.url)}
                alt={poke.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-lg transition-transform group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <h2 className="capitalize text-gray-800 font-semibold text-center text-sm sm:text-base tracking-wide">
              {poke.name}
            </h2>
            <div className="mt-2 text-xs text-gray-500 font-mono">
              #{String(poke.url.split("/")[6]).padStart(3, '0')}
            </div>
          </div>
        ))}
      </main>

      <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        <button
          onClick={prevPage}
          disabled={offset === 0}
          className="px-6 py-3 bg-white/90 text-red-600 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-lg border-2 border-white/20"
        >
          ⬅ Anterior
        </button>
        <span className="bg-white/90 px-4 py-2 rounded-lg text-red-600 font-bold shadow-lg border-2 border-white/20">
          Página {offset / limit + 1}
        </span>
        <button
          onClick={nextPage}
          className="px-6 py-3 bg-white/90 text-red-600 rounded-xl font-semibold hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-lg border-2 border-white/20"
        >
          Siguiente ➡
        </button>
      </div>

      {selected && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div 
            className="bg-gradient-to-br from-white to-gray-100 rounded-3xl p-6 shadow-2xl w-full max-w-sm border-4 border-white/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl transition-colors bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
            >
              ✖
            </button>
            
            <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl p-4 mb-4 shadow-inner">
              <img
                src={selected.sprites.other["official-artwork"].front_default}
                alt={selected.name}
                className="w-48 h-48 mx-auto drop-shadow-2xl"
              />
            </div>
            
            <h2 className="text-3xl font-bold text-center capitalize text-red-600 mb-2 font-pokemon tracking-wide">
              {selected.name}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-center">
              <div className="bg-white rounded-xl p-3 shadow-lg border-2 border-gray-100">
                <p className="text-sm text-gray-600 font-semibold">Altura</p>
                <p className="text-lg font-bold text-gray-800">{selected.height / 10} m</p>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-lg border-2 border-gray-100">
                <p className="text-sm text-gray-600 font-semibold">Peso</p>
                <p className="text-lg font-bold text-gray-800">{selected.weight / 10} kg</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-100">
              <p className="text-sm text-gray-600 font-semibold mb-2 text-center">Tipos</p>
              <div className="flex flex-wrap justify-center gap-2">
                {selected.types.map((t) => (
                  <span
                    key={t.type.name}
                    className={`px-3 py-1 rounded-full text-white font-semibold text-sm capitalize ${
                      typeColors[t.type.name] || "bg-gray-500"
                    } shadow-md`}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;