import { useEffect, useState } from "react";
import { BsToggle2Off, BsToggle2On } from "react-icons/bs";
import { ThemeType } from "../Types";

export const ToggleTheme = () => {
  const [theme, setTheme] = useState<ThemeType>(
    () => (localStorage.getItem("theme") as ThemeType) || "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="w-full flex justify-center p-5 bg-white dark:bg-gray-800 shadow-md fixed">
      <div className="max-w-[1440px] w-full flex justify-end">
        {theme === "light" ? (
          <BsToggle2Off
            color="teal"
            size={40}
            onClick={() => setTheme("dark")}
          />
        ) : (
          <BsToggle2On
            color="teal"
            size={40}
            onClick={() => setTheme("light")}
          />
        )}
      </div>
    </div>
  );
};
