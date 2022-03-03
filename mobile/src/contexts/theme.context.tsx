import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import React, { createContext, FunctionComponent, useState } from "react";

interface IThemeContext {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider: FunctionComponent = ({ children }) => {
  const [theme, setTheme] = useState<string>("light");

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ApplicationProvider {...eva} theme={eva[theme]}>
        {children}
      </ApplicationProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Partial<IThemeContext> => {
  const { theme, toggleTheme } = React.useContext(ThemeContext);

  return { theme, toggleTheme };
};
