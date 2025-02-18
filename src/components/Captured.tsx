import { useState } from "react";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CapturedPokemonType } from "../Types";

export const Captured = () => {
  const [isGrid, setIsGrid] = useState(true);
  const [searchPokemon, setSearchPokemon] = useState("");
  const [capturedPokemon, setCapturedPokemon] = useState<CapturedPokemonType[]>(
    JSON.parse(localStorage.getItem("CapturedPokemon") || "[]")
  );

  // Filter pokemon based on search result
  const filteredPokemon = capturedPokemon.filter(
    (pokemon: CapturedPokemonType) =>
      pokemon.name.toLowerCase().includes(searchPokemon.toLowerCase())
  );

  // Delete pokemon on CapturedPokemon localStorage
  const removePokemon = (index: number) => {
    const confirm = window.confirm("Do you want to remove this pokemon?");
    if (confirm) {
      const updatedCapturedPokemon = capturedPokemon.filter(
        (pokemon) => pokemon.index !== index
      );
      setCapturedPokemon(updatedCapturedPokemon);
      localStorage.setItem(
        "CapturedPokemon",
        JSON.stringify(updatedCapturedPokemon)
      );
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start py-[100px] px-[50px] bg-white dark:bg-gray-800">
      <div className="max-w-[1440px] w-full flex flex-col gap-10">
        {/* Title container */}
        <div className="w-full flex justify-between items-center">
          <h1 className="font-primary text-gray dark:text-white text-7xl">
            Captured Pokemon
          </h1>
          <div className="flex justify-between items-center gap-5">
            {/* Captured Link */}
            <Link
              to="/"
              className="bg-teal-700 hover:bg-teal-800 transition ease-in py-[14px] px-[35px] font-primary rounded-sm text-white shadow-md dark:text-white"
            >
              Pokedex
            </Link>

            {/* Grid and List View */}
            {isGrid ? (
              <FaThList
                color="teal"
                size={40}
                onClick={() => setIsGrid(false)}
              />
            ) : (
              <BsGrid3X3GapFill
                color="teal"
                size={40}
                onClick={() => setIsGrid(true)}
              />
            )}
          </div>
        </div>

        {/* SearchBar */}
        <div className="flex self-start w-[500px]">
          <input
            type="text"
            placeholder="Search Pokemon ...."
            value={searchPokemon}
            onChange={(e) => setSearchPokemon(e.target.value)}
            className="p-3 dark:text-white font-primary border w-full rounded-md outline-none"
          />
        </div>

        {/* Pokedex Content */}
        <div className="flex flex-row gap-5 justify-start flex-wrap">
          {filteredPokemon.length > 0 ? (
            filteredPokemon.map((pokemon: CapturedPokemonType) => (
              <div
                key={pokemon.index}
                className={
                  isGrid
                    ? "flex flex-col justify-center gap-5 items-center w-[18.8%] p-5 bg-black rounded-md"
                    : "flex flex-row justify-between gap-5 items-center w-full px-10 bg-black rounded-md"
                }
              >
                <div
                  className={
                    isGrid
                      ? "flex flex-col items-center"
                      : "flex flex-row p-3 gap-5 items-center"
                  }
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.index}.png`}
                  />
                  <p
                    className={
                      isGrid
                        ? "font-primary capitalize text-white"
                        : "font-primary capitalize text-xl text-white"
                    }
                  >
                    {pokemon.name} - "{pokemon.nickname}"
                  </p>
                  <p
                    className={
                      isGrid
                        ? "font-primary text-teal-800 font-bold"
                        : "font-primary text-xl text-teal-800 font-bold"
                    }
                  >
                    Captured on {pokemon.date}
                  </p>
                </div>
                <span
                  onClick={() => removePokemon(pokemon.index)}
                  className="text-white px-5 py-3 bg-red-800 hover:bg-red-900 transition ease-in rounded-sm"
                >
                  Remove
                </span>
              </div>
            ))
          ) : (
            <h2 className="text-gray-500 font-primary text-2xl">
              No Pokemon found.
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};
