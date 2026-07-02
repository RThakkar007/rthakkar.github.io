import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  /** When true, renders as a compact icon-only button (for navbar) */
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={`flex items-center justify-center h-9 w-9 rounded-lg border transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
          ${isDark
            ? "bg-muted/40 border-border hover:bg-muted/70 hover:border-primary/40 text-foreground hover:text-primary"
            : "bg-amber-50 border-amber-200 hover:bg-amber-100 hover:border-amber-400 text-amber-600"
          }`}
      >
        {isDark
          ? <Moon className="w-4 h-4" />
          : <Sun className="w-4 h-4" />
        }
      </button>
    );
  }

  /* Full toggle switch — used in mobile drawer */
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none
        focus-visible:ring-2 focus-visible:ring-primary flex-shrink-0
        ${isDark
          ? "bg-slate-700 border border-slate-500/40"
          : "bg-amber-300 border border-amber-400/40"
        }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full shadow transition-all duration-300
          flex items-center justify-center
          ${isDark
            ? "left-0.5 bg-slate-900"
            : "left-[calc(100%-1.375rem)] bg-white"
          }`}
      >
        {isDark
          ? <Moon className="w-3 h-3 text-cyan-400" />
          : <Sun className="w-3 h-3 text-amber-500" />
        }
      </span>
    </button>
  );
}
