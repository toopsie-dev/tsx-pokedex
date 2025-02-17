import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SelectedPokemonType } from "../Types";

export const Tag = () => {
  const navigate = useNavigate();

  const selectedPokemon: SelectedPokemonType = JSON.parse(
    localStorage.getItem("SelectedPokemon") || "[]"
  );

  const [formData, setFormData] = useState({
    nickname: "",
    date: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.nickname || !formData.date)
      return alert("Please fill in both fields.");

    const capturedPokemon = {
      ...selectedPokemon,
      nickname: formData.nickname,
      date: formData.date,
    };

    const storedCapturedPokemon = JSON.parse(
      localStorage.getItem("CapturedPokemon") || "[]"
    );

    const updatedCapturedPokemon = [...storedCapturedPokemon, capturedPokemon];

    localStorage.setItem(
      "CapturedPokemon",
      JSON.stringify(updatedCapturedPokemon)
    );
    alert("Captured Pokemon saved!");
    navigate("/", { replace: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start py-[100px] px-[50px] bg-white dark:bg-gray-800">
      <div className="max-w-[800px] w-full flex flex-col gap-10">
        <div className="w-full flex justify-between items-center">
          <h1 className="font-primary text-gray dark:text-white text-5xl">
            Tag as Captured
          </h1>
          <Link
            to="/"
            className="bg-teal-700 hover:bg-teal-800 transition ease-in py-[14px] px-[35px] font-primary rounded-sm text-white dark:text-white shadow-md"
          >
            Back to Pokedex
          </Link>
        </div>

        <div className="flex flex-row-reverse items-center justify-center gap-[100px] bg-gray-400 rounded-md p-[40px]">
          <div className="flex flex-col items-center justify-center p-5 gap-5 bg-black rounded-md">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemon.index}.png`}
              className="w-[200px]"
            />
            <h2 className="text-white text-4xl capitalize font-primary">
              {selectedPokemon.name}
            </h2>
          </div>

          <form
            className="flex flex-col items-start w-[90%] gap-5 mt-5"
            onSubmit={handleSubmit}
          >
            <h3 className="text-black font-primary text-xl">Status</h3>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="Enter Nickname .."
              className="font-primary border border-gray-600 rounded-md outline-none p-3 w-full"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="font-primary border border-gray-600 rounded-md outline-none p-3 w-full"
            />
            <button
              type="submit"
              className="text-white px-5 py-3 bg-teal-700 hover:bg-teal-800 transition ease-in rounded-sm shadow-md"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
