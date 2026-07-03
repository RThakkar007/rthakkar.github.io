import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/i18n";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
      zIndex: 9999,
    });
  }, []);

  useEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    function handleScroll() { if (open) updatePosition(); }
    function handleResize() { if (open) updatePosition(); }
    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, updatePosition]);

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

  /* ── Dropdown mode: used in desktop navbar — rendered via Portal so it
     floats above ALL content and is never clipped by the navbar stacking context ── */
  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
          bg-muted/40 hover:bg-muted/70 border border-border hover:border-primary/40
          text-foreground hover:text-primary transition-all duration-200 h-9 whitespace-nowrap"
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="max-w-[64px] truncate">{current.nativeLabel}</span>
        <ChevronDown
          className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="w-48 rounded-xl border border-border bg-background
            shadow-2xl shadow-black/40 overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-150"
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
              {language === lang.code && (
                <Check className="w-3.5 h-3.5 ml-auto flex-shrink-0 text-primary" />
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
