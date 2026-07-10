import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Navigation, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Mappls (MapMyIndia) REST API — static key used directly as access_token
// Docs: https://developer.mappls.com/mapping/autosuggest-api/
const MAPPLS_KEY = import.meta.env.VITE_MAPPLS_API_KEY as string | undefined;

const AUTOSUGGEST_URL =
  "https://search.mappls.com/search/places/autosuggest/json";

// Mappls Reverse Geocode REST API
// Docs: https://developer.mappls.com/mapping/reverse-geocoding-api/
const REVERSE_GEOCODE_URL =
  "https://apis.mappls.com/advancedmaps/v1";

interface Suggestion {
  placeName: string;
  placeAddress: string;
  eLoc: string;
}

interface Props {
  value: string;
  onChange: (address: string) => void;
  error?: boolean;
}

export default function AddressAutocomplete({ value, onChange, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Sync external value changes (e.g. GPS fill)
  useEffect(() => {
    setInputValue(value);
    if (inputRef.current) inputRef.current.value = value;
  }, [value]);

  // Try to get rough user location for better suggestions (non-blocking)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}, // silent fail
        { timeout: 5000, maximumAge: 300000 }
      );
    }
  }, []);

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!MAPPLS_KEY || query.length < 3) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams({
          query,
          access_token: MAPPLS_KEY,
          region: "IND",
          ...(userLocation
            ? { location: `${userLocation.lat},${userLocation.lng}` }
            : {}),
        });
        const res = await fetch(`${AUTOSUGGEST_URL}?${params}`);
        if (!res.ok) throw new Error(`Mappls API error: ${res.status}`);
        const data = await res.json();
        const results: Suggestion[] = (data.suggestedLocations ?? [])
          .slice(0, 6)
          .map((s: any) => ({
            placeName: s.placeName ?? "",
            placeAddress: s.placeAddress ?? "",
            eLoc: s.eLoc ?? "",
          }));
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (err) {
        console.warn("Mappls autosuggest error:", err);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    },
    [userLocation]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
  };

  const handleSelect = (s: Suggestion) => {
    const full = s.placeAddress
      ? `${s.placeName}, ${s.placeAddress}`
      : s.placeName;
    setInputValue(full);
    onChange(full);
    setSuggestions([]);
    setShowDropdown(false);
    if (inputRef.current) inputRef.current.blur();
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    setSuggestions([]);
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  // Mappls Reverse Geocode REST API
  // Endpoint: GET /advancedmaps/v1/{key}/rev_geocode?lat=...&lng=...
  const reverseGeocode = async (
    lat: number,
    lng: number
  ): Promise<string | null> => {
    if (!MAPPLS_KEY) return null;
    try {
      const res = await fetch(
        `${REVERSE_GEOCODE_URL}/${MAPPLS_KEY}/rev_geocode?lat=${lat}&lng=${lng}`
      );
      if (!res.ok) return null;
      const data = await res.json();
      // Response: { results: [{ formatted_address, ... }] }
      const addr =
        data?.results?.[0]?.formatted_address ??
        data?.results?.[0]?.address ??
        null;
      return addr;
    } catch {
      return null;
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        // Try Mappls reverse geocode
        const addr = await reverseGeocode(latitude, longitude);
        if (addr) {
          setInputValue(addr);
          onChange(addr);
          if (inputRef.current) inputRef.current.value = addr;
          toast.success("Location detected!");
        } else {
          // Fallback: use coordinates as address hint
          const fallback = `Near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setInputValue(fallback);
          onChange(fallback);
          toast.info("Location detected. Please refine your address if needed.");
        }
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Location permission denied. Please type your address.");
        } else {
          toast.error("Could not get your location. Please type your address.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      {/* Address input with autocomplete dropdown */}
      <div className="relative">
        <div
          className={`relative rounded-md border bg-background transition-colors ${
            error
              ? "border-red-500"
              : "border-input hover:border-primary/40 focus-within:border-primary"
          }`}
        >
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder={
              MAPPLS_KEY
                ? "Start typing your address..."
                : "Enter your full address..."
            }
            autoComplete="off"
            className="w-full pl-9 pr-10 py-3 bg-transparent text-foreground text-sm focus:outline-none rounded-md min-h-[44px]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {loading && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
            {inputValue && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground p-1 min-w-[32px] min-h-[32px] flex items-center justify-center rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Suggestions dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-white/10
            bg-[#0d1117] shadow-2xl shadow-black/40 overflow-hidden max-h-72 overflow-y-auto"
          >
            {suggestions.map((s, i) => (
              <button
                key={s.eLoc || i}
                type="button"
                onMouseDown={() => handleSelect(s)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5
                  transition-colors border-b border-white/5 last:border-0"
              >
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {s.placeName}
                  </p>
                  {s.placeAddress && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {s.placeAddress}
                    </p>
                  )}
                </div>
              </button>
            ))}
            <div className="px-4 py-2 text-xs text-slate-600 text-right">
              Powered by Mappls
            </div>
          </div>
        )}
      </div>

      {/* GPS button */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5
          text-muted-foreground hover:text-primary transition-all min-h-[44px]"
        onClick={handleCurrentLocation}
        disabled={locating}
      >
        {locating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Detecting your
            location...
          </>
        ) : (
          <>
            <Navigation className="w-4 h-4" /> Use My Current Location
          </>
        )}
      </Button>

      {error && (
        <p className="text-xs text-red-400">
          Please enter a complete address (at least 5 characters).
        </p>
      )}
    </div>
  );
}
