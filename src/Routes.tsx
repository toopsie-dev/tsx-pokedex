import { Route, Routes } from "react-router-dom";
import { Captured } from "./components/Captured";
import { Pokedex } from "./components/Pokedex";
import { Tag } from "./components/Tag";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Pokedex />} />
      <Route path="/captured" element={<Captured />} />
      <Route path="/tag" element={<Tag />} />
    </Routes>
  );
};
