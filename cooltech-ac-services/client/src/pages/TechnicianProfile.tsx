import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle, ArrowLeft, Phone, MessageSquare, Star,
  Briefcase, Award, MapPin, Clock, Shield, Snowflake
} from "lucide-react";

export default function TechnicianProfile() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = parseInt(idParam ?? "0");

  const { data: tech, isLoading } = trpc.technicians.getById.useQuery({ id }, { enabled: !!id });
  const { data: reviews } = trpc.reviews.byTechnician.useQuery({ technicianId: id }, { enabled: !!id });

  if (isLoading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    </div>
  );

  if (!tech) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">Technician not found.</p>
        <Link href="/technicians"><Button variant="outline">Find Technicians</Button></Link>
      </div>
    </div>
  );

  const specs: string[] = tech.specializations ? JSON.parse(tech.specializations) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero text-white py-12">
        <div className="container">
          <Link href="/technicians">
            <Button variant="ghost" size="sm" className="mb-4 gap-2 text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" /> Back to Locator
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <img
                src={tech.photoUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.name}`}
                alt={tech.name}
                className="w-24 h-24 rounded-2xl object-cover bg-white/10 border-4 border-white/30"
              />
              {tech.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tech.name}</h1>
                {tech.isVerified && <Badge className="bg-blue-500 text-white border-0">Verified Pro</Badge>}
                <Badge className={`${tech.isAvailable ? "bg-green-500" : "bg-amber-500"} text-white border-0`}>
                  {tech.isAvailable ? "Available" : "Busy"}
                </Badge>
              </div>
              <StarRating rating={parseFloat(tech.rating ?? "4.8")} reviewCount={tech.reviewCount ?? 0} size="lg" />
              <div className="flex flex-wrap gap-4 mt-3 text-white/80 text-sm">
                <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" />{tech.yearsExperience} years experience</div>
                <div className="flex items-center gap-1.5"><Award className="w-4 h-4" />{tech.completedJobs?.toLocaleString()} jobs done</div>
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />Delhi NCR</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Link href="/book">
                <Button className="bg-white text-primary hover:bg-white/90 font-bold gap-2 btn-scale">
                  <Snowflake className="w-4 h-4" /> Book This Tech
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Call
                </Button>
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex-1 bg-slate-50 py-10">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              {tech.bio && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-bold text-foreground mb-3">About</h2>
                    <p className="text-muted-foreground leading-relaxed">{tech.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Specializations */}
              {specs.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-bold text-foreground mb-3">Specializations</h2>
                    <div className="flex flex-wrap gap-2">
                      {specs.map((s) => (
                        <Badge key={s} variant="secondary" className="text-sm py-1 px-3">{s}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Rating", value: tech.rating ?? "4.8", icon: Star, color: "text-amber-500" },
                  { label: "Reviews", value: tech.reviewCount?.toString() ?? "0", icon: MessageSquare, color: "text-blue-500" },
                  { label: "Jobs Done", value: tech.completedJobs?.toLocaleString() ?? "0", icon: Award, color: "text-green-500" },
                  { label: "Experience", value: `${tech.yearsExperience}y`, icon: Clock, color: "text-purple-500" },
                ].map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="p-4 text-center">
                      <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Reviews */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-bold text-foreground mb-4">Customer Reviews</h2>
                  {(reviews?.length ?? 0) === 0 ? (
                    <p className="text-muted-foreground text-sm">No reviews yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews?.map((review) => (
                        <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
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
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4">Book {tech.name.split(" ")[0]}</h3>
                  <Link href="/book">
                    <Button className="w-full gradient-brand text-white border-0 btn-scale py-5 text-base mb-3">
                      Book Now
                    </Button>
                  </Link>
                  <div className="space-y-3 pt-3 border-t">
                    {[
                      { icon: Shield, text: "Background verified" },
                      { icon: Award, text: "Certified AC technician" },
                      { icon: CheckCircle, text: "30-day service warranty" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <item.icon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item.text}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
