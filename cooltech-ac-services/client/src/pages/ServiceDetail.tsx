import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle2, Clock, ShoppingCart, ArrowLeft, Star } from "lucide-react";

const SESSION_KEY = "cooltech_cart_session";
function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) { id = Math.random().toString(36).slice(2); localStorage.setItem(SESSION_KEY, id); }
  return id;
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading } = trpc.services.getBySlug.useQuery({ slug: slug ?? "" });
  const { data: reviews } = trpc.reviews.byService.useQuery({ serviceId: service?.id ?? 0 }, { enabled: !!service?.id });

  const utils = trpc.useUtils();
  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => { utils.cart.get.invalidate(); toast.success(`${service?.name} added to cart!`); },
  });

  if (isLoading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    </div>
  );

  if (!service) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">Service not found.</p>
        <Link href="/services"><Button variant="outline">Back to Services</Button></Link>
      </div>
    </div>
  );

  const highlights: string[] = service.highlights ? JSON.parse(service.highlights) : [];
  const discount = service.originalPrice ? Math.round((1 - parseFloat(service.basePrice) / parseFloat(service.originalPrice)) * 100) : 0;
  const sessionId = getSessionId();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        <Link href="/services">
          <Button variant="ghost" size="sm" className="mb-6 gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">{service.category}</Badge>
              <h1 className="text-3xl font-bold text-foreground mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{service.name}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <StarRating rating={parseFloat(service.rating ?? "4.75")} reviewCount={service.reviewCount ?? 0} size="md" />
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{service.durationMinutes} min</span>
                </div>
              </div>
            </div>

            {service.description && (
              <div>
                <h2 className="font-semibold text-foreground mb-2">About this service</h2>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            )}

            {highlights.length > 0 && (
              <div>
                <h2 className="font-semibold text-foreground mb-3">What's included</h2>
                <ul className="space-y-2">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews */}
            {(reviews?.length ?? 0) > 0 && (
              <div>
                <h2 className="font-semibold text-foreground mb-4">Customer Reviews</h2>
                <div className="space-y-4">
                  {reviews?.slice(0, 5).map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm">
                            {review.authorName?.[0]?.toUpperCase() ?? "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{review.authorName}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-primary">₹{parseFloat(service.basePrice).toLocaleString("en-IN")}</div>
                  {service.originalPrice && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground line-through">₹{parseFloat(service.originalPrice).toLocaleString("en-IN")}</span>
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">{discount}% off</Badge>
                    </div>
                  )}
                  {service.unit && <p className="text-xs text-muted-foreground mt-1">{service.unit}</p>}
                </div>

                <div className="space-y-3">
                  <Link href={`/book/${service.id}`}>
                    <Button className="w-full gradient-brand text-white border-0 btn-scale text-base py-5">
                      Book Now
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full gap-2 btn-scale"
                    onClick={() => addToCart.mutate({ sessionId, serviceId: service.id })}
                    disabled={addToCart.isPending}
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t space-y-2">
                  {[
                    "Fixed price, no surprises",
                    "Background-verified professional",
                    "30-day service warranty",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
