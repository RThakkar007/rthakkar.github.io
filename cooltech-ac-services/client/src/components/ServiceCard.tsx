import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import StarRating from "./StarRating";
import { Clock, ShoppingCart, Zap, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

const SESSION_KEY = "cooltech_cart_session";
function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) { id = Math.random().toString(36).slice(2); localStorage.setItem(SESSION_KEY, id); }
  return id;
}

interface ServiceCardProps {
  service: {
    id: number;
    slug: string;
    name: string;
    category: string;
    description: string | null;
    basePrice: string;
    originalPrice: string | null;
    durationMinutes: number;
    unit: string | null;
    rating: string | null;
    reviewCount: number | null;
    isPopular: boolean | null;
    highlights: string | null;
  };
  compact?: boolean;
}

const categoryColors: Record<string, string> = {
  cleaning: "bg-cyan-100 text-cyan-700",
  repair: "bg-orange-100 text-orange-700",
  installation: "bg-green-100 text-green-700",
  gas: "bg-purple-100 text-purple-700",
};

const categoryLabels: Record<string, string> = {
  cleaning: "Cleaning",
  repair: "Repair",
  installation: "Installation",
  gas: "Gas Service",
};

export default function ServiceCard({ service, compact = false }: ServiceCardProps) {
  const utils = trpc.useUtils();
  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
      toast.success(`${service.name} added to cart!`);
    },
  });

  const sessionId = getSessionId();
  const highlights: string[] = service.highlights ? JSON.parse(service.highlights) : [];
  const discount = service.originalPrice
    ? Math.round((1 - parseFloat(service.basePrice) / parseFloat(service.originalPrice)) * 100)
    : 0;

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h} hr${h > 1 ? "s" : ""}`;
  };

  return (
    <Card className={cn("card-hover overflow-hidden border-border group", compact ? "" : "")}>
      <CardContent className="p-0">
        {/* Top accent bar */}
        <div className="h-1 gradient-brand" />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge variant="secondary" className={cn("text-xs font-medium", categoryColors[service.category])}>
                  {categoryLabels[service.category]}
                </Badge>
                {service.isPopular && (
                  <Badge className="text-xs gradient-brand text-white border-0">
                    <Zap className="w-3 h-3 mr-1" /> Popular
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-foreground text-base leading-tight">{service.name}</h3>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-lg text-primary">
                {service.unit === "starts at" || service.unit === "per service"
                  ? `₹${parseFloat(service.basePrice).toLocaleString("en-IN")}`
                  : `₹${parseFloat(service.basePrice).toLocaleString("en-IN")}`}
              </div>
              {service.originalPrice && (
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{parseFloat(service.originalPrice).toLocaleString("en-IN")}
                  </span>
                  <Badge className="text-[10px] bg-green-100 text-green-700 border-0">{discount}% off</Badge>
                </div>
              )}
              {service.unit && service.unit !== "per service" && (
                <p className="text-xs text-muted-foreground mt-0.5">{service.unit}</p>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-3">
            <StarRating
              rating={parseFloat(service.rating ?? "4.75")}
              reviewCount={service.reviewCount ?? 0}
              size="sm"
            />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDuration(service.durationMinutes)}</span>
            </div>
          </div>

          {/* Description */}
          {!compact && service.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
          )}

          {/* Highlights */}
          {!compact && highlights.length > 0 && (
            <ul className="space-y-1 mb-4">
              {highlights.slice(0, 3).map((h, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5 btn-scale"
              onClick={() => addToCart.mutate({ sessionId, serviceId: service.id })}
              disabled={addToCart.isPending}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </Button>
            <Link href={`/book/${service.id}`} className="flex-1">
              <Button size="sm" className="w-full gradient-brand text-white border-0 btn-scale">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
