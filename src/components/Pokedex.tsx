import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CapturedPokemonType, PokemonType } from "../Types";

const fetchPokemon = async (page = 0) => {
  const limit = 20;
  const offset = page * limit; // e.g 2 * 20 = 40
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );
  const data = await response.json();
  return {
    pokemon: data.results,
    hasMore: !!data.next, // return boolean
  };
};

export const Pokedex = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isGrid, setIsGrid] = useState(true);
  const [searchPokemon, setSearchPokemon] = useState("");
  const [page, setPage] = useState(0);
  const capturedPokemon = JSON.parse(
    localStorage.getItem("CapturedPokemon") || "[]"
  );

  // Fetching API Request
  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: ["pokemon", page],
    queryFn: () => fetchPokemon(page),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  // Prefetch the next page!
  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ["pokemon", page + 1],
        queryFn: () => fetchPokemon(page + 1),
      });
    }
  }, [data, isPlaceholderData, page, queryClient]);

  if (isLoading) return <h2>Page is Loading</h2>;
  if (isError) return <h2>{error.message}</h2>;

  // Extract and flatten a list of Pokemon
  const allPokemon = data?.pokemon ?? [];

  // Filter pokemon based on search result
  const filteredPokemon = allPokemon.filter((pokemon: PokemonType) =>
    pokemon.name.toLowerCase().includes(searchPokemon.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen flex justify-center items-start py-[100px] px-[50px] bg-white dark:bg-gray-800">
      <div className="max-w-[1440px] w-full flex flex-col gap-10">
        {/* Title container */}
        <div className="w-full flex justify-between items-center">
          <h1 className="font-primary text-gray dark:text-white text-7xl">
            Pokedex
          </h1>
          <div className="flex justify-between items-center gap-5">
            {/* Captured Link */}
            <Link
              to="/captured"
              className="bg-teal-700 shadow-md hover:bg-teal-800 transition ease-in py-[14px] px-[35px] font-primary rounded-sm text-white dark:text-white"
            >
              Captured
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
        <div className="flex flex-row gap-5 justify-between flex-wrap">
          {filteredPokemon.length > 0 ? (
            filteredPokemon.map((pokemon: PokemonType) => {
              // Find the captured Pokemon that matches the pokemon pokedex
              const capturedPokemonData = capturedPokemon.find(
                (captured: CapturedPokemonType) =>
                  captured.name.toLowerCase() === pokemon.name.toLowerCase()
              );

              // Get the last id of url to make the data unique
              const pokemonId = pokemon.url.split("/").filter(Boolean).pop();

              return (
                <div
                  key={pokemon.name}
                  className={
                    isGrid
                      ? "flex flex-col justify-center gap-5 items-center w-[18.8%] p-5 bg-black rounded-md shadow-md"
                      : "flex flex-row justify-between gap-5 items-center w-full px-10 bg-black rounded-md shadow-md"
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
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                    />
                    <p
                      className={
                        isGrid
                          ? "font-primary capitalize text-white"
                          : "font-primary capitalize text-xl text-white"
                      }
                    >
                      {pokemon.name}
                    </p>
                  </div>

                  {/* Check if the Pokemon is already captured */}
                  {capturedPokemonData ? (
                    <p
                      className={
                        isGrid
                          ? "text-teal-800 font-semibold text-sm"
                          : "text-teal-800 font-semibold text-lg"
                      }
                    >
                      {capturedPokemonData.nickname} - Captured on{" "}
                      {capturedPokemonData.date}
                    </p>
                  ) : (
                    <span
                      onClick={() => {
                        const selectedPokemon = {
                          index: pokemonId,
                          ...pokemon,
                        };
                        localStorage.setItem(
                          "SelectedPokemon",
                          JSON.stringify(selectedPokemon)
                        );
                        navigate("/tag", { replace: true });
                      }}
                      className="text-white px-5 py-3 bg-teal-700 hover:bg-teal-800 transition ease-in rounded-sm shadow-md"
                    >
                      Tag as Captured
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <h2 className="text-gray-500 font-primary text-2xl">
              No Pokemon found.
            </h2>
          )}
        </div>

        {/* Previous and next button */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 bg-teal-700 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!data?.hasMore}
            className="px-4 py-2 bg-teal-700 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
