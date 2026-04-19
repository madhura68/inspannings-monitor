"use client";

import * as React from "react";

const STORAGE_KEY = "inspannings-monitor-theme";

export type ThemeName = "light" | "dark" | "system";
export type ResolvedThemeName = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  resolvedTheme: ResolvedThemeName;
  systemTheme: ResolvedThemeName;
  themes: ThemeName[];
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const AVAILABLE_THEMES: ThemeName[] = ["light", "dark", "system"];

function getSystemTheme(): ResolvedThemeName {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(
  defaultTheme: ThemeName,
  enableSystem: boolean,
): ThemeName {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  if (storedTheme === "system" && enableSystem) {
    return storedTheme;
  }

  return defaultTheme;
}

function applyResolvedTheme(resolvedTheme: ResolvedThemeName) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolvedTheme);
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
}

function withDisabledTransitions(action: () => void) {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*{-webkit-transition:none!important;transition:none!important}",
    ),
  );

  document.head.appendChild(style);
  action();

  window.getComputedStyle(document.body);

  requestAnimationFrame(() => {
    document.head.removeChild(style);
  });
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const initialSystemTheme = React.useMemo(() => getSystemTheme(), []);
  const [theme, setThemeState] = React.useState<ThemeName>(() =>
    typeof window === "undefined"
      ? defaultTheme
      : readStoredTheme(defaultTheme, enableSystem),
  );
  const [systemTheme, setSystemTheme] =
    React.useState<ResolvedThemeName>(initialSystemTheme);
  const [resolvedTheme, setResolvedTheme] =
    React.useState<ResolvedThemeName>(() => {
      if (typeof window === "undefined") {
        return defaultTheme === "light" ? "light" : "dark";
      }

      const currentTheme = readStoredTheme(defaultTheme, enableSystem);
      return currentTheme === "system" ? getSystemTheme() : currentTheme;
    });

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function syncTheme(nextTheme: ThemeName) {
      const nextSystemTheme = getSystemTheme();
      const nextResolvedTheme =
        nextTheme === "system" ? nextSystemTheme : nextTheme;

      const apply = () => applyResolvedTheme(nextResolvedTheme);

      if (disableTransitionOnChange) {
        withDisabledTransitions(apply);
      } else {
        apply();
      }

      document.documentElement.dataset.themePreference = nextTheme;
      setSystemTheme(nextSystemTheme);
      setResolvedTheme(nextResolvedTheme);
    }

    syncTheme(theme);

    function handleStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) {
        return;
      }

      const nextTheme =
        event.newValue === "light" ||
        event.newValue === "dark" ||
        (event.newValue === "system" && enableSystem)
          ? (event.newValue as ThemeName)
          : defaultTheme;

      setThemeState(nextTheme);
      syncTheme(nextTheme);
    }

    function handleSystemThemeChange() {
      const nextSystemTheme = getSystemTheme();
      setSystemTheme(nextSystemTheme);

      if (theme === "system") {
        const apply = () => applyResolvedTheme(nextSystemTheme);

        if (disableTransitionOnChange) {
          withDisabledTransitions(apply);
        } else {
          apply();
        }

        setResolvedTheme(nextSystemTheme);
      }
    }

    window.addEventListener("storage", handleStorage);
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [defaultTheme, disableTransitionOnChange, enableSystem, theme]);

  const setTheme = React.useCallback(
    (nextTheme: ThemeName) => {
      setThemeState(nextTheme);
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    },
    [],
  );

  const contextValue = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme,
      themes: enableSystem ? AVAILABLE_THEMES : ["light", "dark"],
    }),
    [enableSystem, resolvedTheme, setTheme, systemTheme, theme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
