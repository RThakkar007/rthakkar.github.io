import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Legal</Badge>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 1, 2025</p>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <section><h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2><p>We collect information you provide directly (name, email, phone, address) and information generated through your use of our services (booking history, location data for GPS assignment).</p></section>
            <section><h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2><p>Your information is used to process bookings, assign technicians, send service updates, and improve our platform. We do not sell your personal data to third parties.</p></section>
            <section><h2 className="text-xl font-semibold text-foreground mb-3">3. Location Data</h2><p>We collect location data to assign the nearest available technician. This data is used only for service delivery and is not stored beyond the active booking period.</p></section>
            <section><h2 className="text-xl font-semibold text-foreground mb-3">4. Data Security</h2><p>We implement industry-standard security measures including encryption, secure storage, and access controls to protect your personal information.</p></section>
            <section><h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights</h2><p>You have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:info.ronakenterprise@gmail.com" className="text-primary hover:underline">info.ronakenterprise@gmail.com</a> to exercise these rights.</p></section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
