import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import ServiceCard from "@/components/ServiceCard";
import { trpc } from "@/lib/trpc";
import {
  Snowflake, MapPin, Shield, Award, Wrench, Zap, CheckCircle, Star,
  ArrowRight, Phone, Clock, ChevronRight, Wind,
  Thermometer, Settings, Package, Search
} from "lucide-react";

// Phase 1: Serving Patan, Gujarat only. More cities coming soon.
const CITIES = ["Patan"];
const COMING_SOON_CITIES = ["Mehsana", "Siddhpur", "Unjha", "Visnagar", "Ahmedabad"];

export default function Home() {
  const [, navigate] = useLocation();
  const [selectedCity, setSelectedCity] = useState("Patan");
  const [citySearch, setCitySearch] = useState("");

  const { data: services, isLoading: servicesLoading } = trpc.services.list.useQuery();
  const { data: technicians } = trpc.technicians.available.useQuery();
  const { data: allReviews } = trpc.reviews.all.useQuery();

  const featuredServices = services?.slice(0, 6) ?? [];
  const featuredTechs = technicians?.slice(0, 3) ?? [];
  const featuredReviews = allReviews?.slice(0, 6) ?? [];

  const filteredCities = CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

  const stats = [
    { value: "2K+", label: "Happy Customers" },
    { value: "20+", label: "Expert Technicians" },
    { value: "4.8★", label: "Average Rating" },
    { value: "45 Min", label: "Avg Response Time" },
  ];

  const trustBadges = [
    { icon: Shield, title: "Transparent Pricing", desc: "See fixed prices before you book. No hidden charges, ever.", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Award, title: "Trained Experts", desc: "Our professionals are certified, background-verified, and have on-job expertise.", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: Package, title: "Fully Equipped", desc: "We bring everything needed to get the job done well. No extra charges.", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: CheckCircle, title: "100% Quality Assured", desc: "If you don't love our service, we will make it right. Guaranteed.", color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const howItWorks = [
    { step: "01", icon: Search, title: "Choose Your Service", desc: "Browse our AC services catalog and select what you need." },
    { step: "02", icon: Clock, title: "Pick Date & Time", desc: "Schedule at your convenience — same day or advance booking." },
    { step: "03", icon: MapPin, title: "Share Your Location", desc: "Enter your address and track your technician in real time." },
    { step: "04", icon: CheckCircle, title: "Job Done!", desc: "Our expert arrives, completes the service, and you pay securely." },
  ];

  const acCategories = [
    { icon: Wind, label: "Foam-jet Cleaning", slug: "foam-jet-1ac", color: "from-cyan-500 to-blue-600", desc: "Deep clean with foam & jet spray" },
    { icon: Wrench, label: "AC Repair", slug: "ac-repair", color: "from-orange-500 to-red-500", desc: "Complete diagnostic & fix" },
    { icon: Thermometer, label: "Gas Refill", slug: "gas-refill", color: "from-purple-500 to-indigo-600", desc: "Refill & pressure check" },
    { icon: Settings, label: "AC Installation", slug: "ac-installation", color: "from-green-500 to-teal-600", desc: "Professional mounting & wiring" },
    { icon: Package, label: "AC Uninstallation", slug: "ac-uninstallation", color: "from-slate-500 to-gray-600", desc: "Safe removal & gas recovery" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="container relative py-16 md:py-24">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              <MapPin className="w-3 h-3 mr-1" /> Now Serving Patan, Gujarat
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Expert AC Services,{" "}
              <span className="text-cyan-300">On Demand</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Patan's most trusted AC service experts — at your doorstep. Certified technicians for repair, installation, cleaning & more. Transparent pricing, no hidden charges.
            </p>
            <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-lg">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">📍 Service Area</p>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="flex-1 text-foreground text-sm font-medium">Patan, Gujarat, India</span>
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Active</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <button className="px-3 py-1.5 rounded-full text-xs font-medium gradient-brand text-white shadow-md">Patan</button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">🚀 Coming soon: Mehsana, Siddhpur, Unjha, Visnagar & more</p>
              <Button className="w-full gradient-brand text-white border-0 btn-scale" onClick={() => navigate("/services")}>
                Find AC Services in {selectedCity} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="container py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) => (<div key={s.label} className="text-center"><div className="text-2xl font-bold text-white">{s.value}</div><div className="text-xs text-white/60">{s.label}</div></div>))}
            </div>
          </div>
        </div>
      </section>

      {/* AC Service Categories */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">AC Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>All AC Services, One Platform</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From routine cleaning to complex installations — our certified technicians handle it all.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {acCategories.map((cat) => (
              <Link key={cat.slug} href={`/services/${cat.slug}`}>
                <Card className="card-hover cursor-pointer h-full group">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <cat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div><p className="font-semibold text-sm text-foreground leading-tight">{cat.label}</p><p className="text-xs text-muted-foreground mt-1">{cat.desc}</p></div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center"><Link href="/services"><Button variant="outline" className="gap-2 btn-scale">View All Services <ChevronRight className="w-4 h-4" /></Button></Link></div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Why Choose CoolTech?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">We set the standard for home AC services with our commitment to quality, safety, and transparency.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge) => (
              <Card key={badge.title} className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${badge.bg} flex items-center justify-center mb-4`}><badge.icon className={`w-6 h-6 ${badge.color}`} /></div>
                  <h3 className="font-bold text-foreground mb-2">{badge.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{badge.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-slate-50">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div><Badge className="mb-2 bg-primary/10 text-primary border-primary/20">Top Picks</Badge><h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Most Booked Services</h2></div>
            <Link href="/services"><Button variant="ghost" size="sm" className="gap-1 text-primary">See all <ChevronRight className="w-4 h-4" /></Button></Link>
          </div>
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />)}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{featuredServices.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-accent/10 text-accent border-accent/20">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Book your AC service in under 2 minutes. Our streamlined process makes it effortless.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative text-center">
                <div className="relative inline-flex mb-4">
                  <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-lg mx-auto"><step.icon className="w-7 h-7 text-white" /></div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-primary text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10"><Link href="/services"><Button className="gradient-brand text-white border-0 btn-scale px-8 py-3 text-base">Book Your Service Now <ArrowRight className="w-4 h-4 ml-2" /></Button></Link></div>
        </div>
      </section>

      {/* Featured Technicians */}
      {featuredTechs.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="container">
            <div className="flex items-end justify-between mb-8">
              <div><Badge className="mb-2 bg-primary/10 text-primary border-primary/20">Our Experts</Badge><h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Top Rated Technicians</h2></div>
              <Link href="/technicians"><Button variant="ghost" size="sm" className="gap-1 text-primary">Find Near Me <ChevronRight className="w-4 h-4" /></Button></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTechs.map((tech) => {
                const specs: string[] = tech.specializations ? JSON.parse(tech.specializations) : [];
                return (
                  <Link key={tech.id} href={`/technicians/${tech.id}`}>
                    <Card className="card-hover cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <img src={tech.photoUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.name}`} alt={tech.name} className="w-16 h-16 rounded-2xl object-cover bg-muted" />
                            {tech.isVerified && <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-white" /></div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-foreground">{tech.name}</h3>
                            <StarRating rating={parseFloat(tech.rating ?? "4.8")} reviewCount={tech.reviewCount ?? 0} size="sm" />
                            <p className="text-xs text-muted-foreground mt-1">{tech.yearsExperience} yrs exp · {tech.completedJobs?.toLocaleString()} jobs</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-4">{specs.slice(0, 2).map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}</div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      {featuredReviews.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-10">
              <Badge className="mb-3 bg-amber-100 text-amber-700 border-amber-200">Customer Stories</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What Our Customers Say</h2>
              <div className="flex items-center justify-center gap-2">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}</div>
                <span className="font-bold text-foreground">4.8</span>
                <span className="text-muted-foreground">from 50,000+ reviews</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredReviews.map((review) => (
                <Card key={review.id} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{review.authorName?.[0]?.toUpperCase() ?? "U"}</div>
                      <div><p className="font-semibold text-sm text-foreground">{review.authorName ?? "Customer"}</p><StarRating rating={review.rating} showValue={false} size="sm" /></div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-16 gradient-hero text-white">
        <div className="container text-center">
          <Snowflake className="w-12 h-12 mx-auto mb-4 text-white/60" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Ready to Book Your AC Service?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">Join 50,000+ satisfied customers. Get expert AC service at your doorstep today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services"><Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold btn-scale px-8">Browse Services</Button></Link>
            <Link href="/technicians"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 btn-scale px-8"><MapPin className="w-4 h-4 mr-2" /> Find Technician Near Me</Button></Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-white/60 text-sm"><Phone className="w-4 h-4" /><span>Call us: 1800-123-4567 (Toll Free)</span></div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
