import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/i18n";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LANGUAGES: { code: Language; label: string; nativeLabel: string; flag: string }[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", nativeLabel: "हिंदी", flag: "🇮🇳" },
  { code: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી", flag: "🇮🇳" },
];

interface LanguageSwitcherProps {
  /** When true, renders as a full-width row list (for mobile drawer) */
  inline?: boolean;
}

export function LanguageSwitcher({ inline = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ── Inline mode: used inside the mobile drawer ── */
  if (inline) {
    return (
      <div className="space-y-1">
        <p className="px-4 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Language
        </p>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all min-h-[48px] ${
              language === lang.code
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted/50"
            }`}
          >
            <span className="text-base leading-none">{lang.flag}</span>
            <span>{lang.nativeLabel}</span>
            <span className="text-xs text-muted-foreground ml-1">({lang.label})</span>
            {language === lang.code && <Check className="w-4 h-4 ml-auto text-primary" />}
          </button>
        ))}
      </div>
    );
  }

  /* ── Dropdown mode: used in desktop navbar ── */
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
          bg-muted/40 hover:bg-muted/70 border border-border hover:border-primary/40
          text-foreground hover:text-primary transition-all duration-200 h-9 whitespace-nowrap"
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="max-w-[64px] truncate">{current.nativeLabel}</span>
        <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border
            bg-background shadow-xl shadow-black/30 overflow-hidden z-[200]
            animate-in fade-in slide-in-from-top-1 duration-150"
          style={{ maxHeight: "calc(100vh - 80px)" }}
        >
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3 h-3" /> Select Language
            </p>
          </div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                language === lang.code
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-muted/50"
              }`}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <div className="flex flex-col items-start min-w-0">
                <span className="font-medium leading-tight">{lang.nativeLabel}</span>
                <span className="text-xs text-muted-foreground leading-tight">{lang.label}</span>
              </div>
              {language === lang.code && <Check className="w-3.5 h-3.5 ml-auto flex-shrink-0 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
