import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Snowflake, Users, Award, Clock, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container max-w-4xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">About Us</Badge>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Keeping You <span className="gradient-text">Cool</span> Since 2020
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 sm:mb-12 max-w-2xl">
            ArcticAC is a technology-driven AC service platform connecting homeowners and businesses with certified AC technicians. We believe in transparent pricing, real-time tracking, and service that just works.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-10 sm:mb-16">
            {[
              { icon: Users, value: "500+", label: "Happy Customers" },
              { icon: Award, value: "50+", label: "Expert Technicians" },
              { icon: Clock, value: "< 2hr", label: "Avg Response Time" },
              { icon: Shield, value: "100%", label: "Satisfaction Rate" },
            ].map((stat, i) => (
              <Card key={i} className="glass-card text-center">
                <CardContent className="p-4 sm:p-6">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our mission is to make AC servicing as simple as ordering food online. We use GPS technology to assign the nearest available technician, give you real-time updates at every stage, and ensure complete transparency in pricing and service quality.
            </p>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["All major AC brands supported", "Certified and background-verified technicians", "Real-time GPS tracking", "Transparent, fixed pricing", "Photo proof on job completion", "24/7 customer support"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
