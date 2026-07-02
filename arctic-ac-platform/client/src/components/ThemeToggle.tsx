import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none
        focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2
        focus-visible:ring-offset-[#0A0E1A] min-h-[40px] min-w-[40px]
        ${isDark
          ? "bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-500/40"
          : "bg-gradient-to-r from-amber-300 to-yellow-400 border border-amber-400/40"
        }`}
    >
      {/* Track icons */}
      <span className={`absolute left-1.5 top-1/2 -translate-y-1/2 transition-opacity duration-200
        ${isDark ? "opacity-100" : "opacity-0"}`}>
        <Moon className="w-3.5 h-3.5 text-cyan-300" />
      </span>
      <span className={`absolute right-1.5 top-1/2 -translate-y-1/2 transition-opacity duration-200
        ${isDark ? "opacity-0" : "opacity-100"}`}>
        <Sun className="w-3.5 h-3.5 text-amber-700" />
      </span>
      {/* Thumb */}
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300
          flex items-center justify-center
          ${isDark
            ? "left-0.5 bg-slate-900 shadow-slate-900/50"
            : "left-[calc(100%-1.625rem)] bg-white shadow-amber-200/50"
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
