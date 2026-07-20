import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Legal</Badge>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 1, 2025</p>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <section><h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2><p>By using ArcticAC services, you agree to these Terms of Service. If you do not agree, please do not use our platform.</p></section>
            <section><h2 className="text-xl font-semibold text-foreground mb-3">2. Services</h2><p>ArcticAC provides an on-demand AC service platform connecting customers with certified technicians. We do not directly employ technicians but facilitate the connection and ensure quality standards.</p></section>
            <section><h2 className="text-xl font-semibold text-foreground mb-3">3. Booking & Payments</h2><p>All bookings are subject to technician availability. Prices are fixed and displayed before booking. Cash on Delivery (COD) is the default payment method. Online payments via Razorpay are also accepted.</p></section>
            <section><h2 className="text-xl font-semibold text-foreground mb-3">4. User Responsibilities</h2><p>Users must provide accurate information when booking. You are responsible for ensuring safe access to the service location. Misuse of the platform may result in account suspension.</p></section>
            <section><h2 className="text-xl font-semibold text-foreground mb-3">5. Limitation of Liability</h2><p>ArcticAC is not liable for any indirect, incidental, or consequential damages arising from the use of our services. Our liability is limited to the amount paid for the specific service.</p></section>
            <section><h2 className="text-xl font-semibold text-foreground mb-3">6. Contact</h2><p>For any questions about these terms, contact us at <a href="mailto:info.ronakenterprise@gmail.com" className="text-primary hover:underline">info.ronakenterprise@gmail.com</a>.</p></section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
