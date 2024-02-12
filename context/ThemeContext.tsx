"use client";

import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext({} as ThemeContextValue);

export const ThemeContextProvider: FC<{
  children: ReactNode;
  initialTheme: Theme;
}> = (props) => {
  const [theme, setTheme] = useState<Theme>(props.initialTheme);

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    document.body.classList.add(theme);
    document.cookie = `theme=${theme};`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  const switchTheme = (theme: Theme) => {
    context.setTheme(theme);
  };

  const activeTheme = context.theme;

  return { switchTheme, activeTheme };
};
