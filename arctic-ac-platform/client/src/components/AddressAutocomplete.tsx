import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL || "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

let scriptLoaded = false;
let scriptLoading = false;
let scriptFailed = false;
const callbacks: Array<() => void> = [];

function loadMapsScript(cb: () => void) {
  if (scriptLoaded) { cb(); return; }
  if (scriptFailed) { cb(); return; }
  callbacks.push(cb);
  if (scriptLoading) return;
  scriptLoading = true;
  const script = document.createElement("script");
  script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=places,geocoding&loading=async`;
  script.async = true;
  script.crossOrigin = "anonymous";
  script.onload = () => {
    scriptLoaded = true;
    callbacks.forEach(fn => fn());
    callbacks.length = 0;
  };
  script.onerror = () => {
    scriptFailed = true;
    scriptLoading = false;
    callbacks.forEach(fn => fn());
    callbacks.length = 0;
  };
  document.head.appendChild(script);
}

interface Props {
  value: string;
  onChange: (address: string) => void;
  error?: boolean;
}

export default function AddressAutocomplete({ value, onChange, error }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [locating, setLocating] = useState(false);
  const [ready, setReady] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    loadMapsScript(() => setReady(true));
  }, []);

  // Sync external value changes (e.g. GPS fill)
  useEffect(() => {
    setInputValue(value);
    if (inputRef.current) inputRef.current.value = value;
  }, [value]);

  useEffect(() => {
    if (!ready || !containerRef.current) return;
    // Guard: if Maps failed to load or places API is unavailable, stay on plain input
    if (!window.google || !window.google.maps || !window.google.maps.places) return;

    // Try new PlaceAutocompleteElement first, fall back to legacy Autocomplete
    try {
      // @ts-ignore — new API
      const pac = new google.maps.places.PlaceAutocompleteElement({
        componentRestrictions: { country: "in" },
      });
      pac.style.width = "100%";
      pac.style.fontSize = "14px";

      // @ts-ignore
      pac.addEventListener("gmp-placeselect", async (e: any) => {
        const place = e.placePrediction.toPlace();
        await place.fetchFields({ fields: ["displayName", "formattedAddress"] });
        const addr = place.formattedAddress || place.displayName || "";
        if (addr) { onChange(addr); setInputValue(addr); }
      });

      // Replace the input with the new element
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(pac);
      }
    } catch {
      // Fallback: legacy Autocomplete widget bound to a plain input
      if (!inputRef.current) return;
      if (!window.google?.maps?.places?.Autocomplete) return;
      const ac = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode", "establishment"],
        componentRestrictions: { country: "in" },
        fields: ["formatted_address", "name"],
      });
      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        const addr = place.formatted_address || place.name || "";
        if (addr) { onChange(addr); setInputValue(addr); }
      });
    }
  }, [ready]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (!window.google) { setLocating(false); return; }
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            setLocating(false);
            if (status === "OK" && results && results[0]) {
              const addr = results[0].formatted_address;
              onChange(addr);
              setInputValue(addr);
              if (inputRef.current) inputRef.current.value = addr;
              toast.success("Location detected!");
            } else {
              toast.error("Could not determine your address. Please type it manually.");
            }
          }
        );
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
      {/* Address input — shows PlaceAutocompleteElement or fallback input */}
      <div
        ref={containerRef}
        className={`relative rounded-md border bg-background transition-colors ${
          error ? "border-red-500" : "border-input hover:border-primary/40"
        }`}
      >
        {/* Fallback plain input (shown until Maps loads or if new API unavailable) */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => { setInputValue(e.target.value); onChange(e.target.value); }}
            placeholder="Start typing your address..."
            className="w-full pl-9 pr-9 py-3 bg-transparent text-foreground text-sm focus:outline-none rounded-md min-h-[44px]"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => { onChange(""); setInputValue(""); if (inputRef.current) inputRef.current.value = ""; }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* GPS button */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all min-h-[44px]"
        onClick={handleCurrentLocation}
        disabled={locating}
      >
        {locating ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Detecting your location...</>
        ) : (
          <><Navigation className="w-4 h-4" /> Use My Current Location</>
        )}
      </Button>

      {error && (
        <p className="text-xs text-red-400">Please enter a complete address (at least 5 characters).</p>
      )}
    </div>
  );
}
