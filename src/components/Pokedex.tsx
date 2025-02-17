import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CapturedPokemonType, PokemonType } from "../Types";

export const Pokedex = () => {
  const navigate = useNavigate();
  const [isGrid, setIsGrid] = useState(true);
  const [offset] = useState(0);
  const [searchPokemon, setSearchPokemon] = useState("");
  const capturedPokemon = JSON.parse(
    localStorage.getItem("CapturedPokemon") || "[]"
  );

  // Fetching API Request
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["pokemon"],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?offset=${pageParam}&limit=20`
      );
      return await response.json();
    },
    initialPageParam: 0,
    getPreviousPageParam: (firstPage) => {
      const prevOffset = firstPage.previous
        ? new URL(firstPage.previous).searchParams.get("offset")
        : undefined;
      return prevOffset ? parseInt(prevOffset) : undefined;
    },
    getNextPageParam: (lastPage) => {
      const currentOffset = lastPage.next?.split("offset=")[1]?.split("&")[0];
      return currentOffset ? parseInt(currentOffset) : undefined;
    },
  });

  if (isLoading) return <h2>Page is Loading</h2>;
  if (isError) return <h2>{error.message}</h2>;

  // Extract and flatten a list of Pokemon
  const allPokemon = data?.pages.flatMap((page) => page.results) ?? [];

  // Filter pokemon based on search result
  const filteredPokemon = allPokemon.filter((pokemon) =>
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
        <div className="flex flex-row gap-5 justify-start flex-wrap">
          {filteredPokemon.length > 0 ? (
            filteredPokemon.map((pokemon: PokemonType, index: number) => {
              // Find the captured Pokemon that matches the pokemon pokedex
              const capturedPokemonData = capturedPokemon.find(
                (captured: CapturedPokemonType) =>
                  captured.name.toLowerCase() === pokemon.name.toLowerCase()
              );

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
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                        offset + index + 1
                      }.png`}
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
                          index: index + 1,
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
            onClick={() => fetchPreviousPage()}
            disabled={!hasPreviousPage}
            className="px-4 py-2 bg-teal-700 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage}
            className="px-4 py-2 bg-teal-700 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
