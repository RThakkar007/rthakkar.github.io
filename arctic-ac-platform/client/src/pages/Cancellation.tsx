import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

export default function Cancellation() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Legal</Badge>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Cancellation & Refund Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 1, 2025</p>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <section><h2 className="text-xl font-semibold text-foreground mb-3">Cancellation Policy</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>Free cancellation up to 2 hours before the scheduled service time.</li>
                <li>Cancellations within 2 hours of the scheduled time may incur a ₹99 cancellation fee.</li>
                <li>No-show cancellations (technician arrives but no access) will be charged the full service fee.</li>
              </ul>
            </section>
            <section><h2 className="text-xl font-semibold text-foreground mb-3">Refund Policy</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>Full refund for cancellations made more than 2 hours in advance.</li>
                <li>Refunds for online payments (Razorpay) are processed within 5–7 business days.</li>
                <li>COD bookings cancelled before service are not charged.</li>
                <li>If the service quality is unsatisfactory, contact us within 24 hours for a free revisit or refund.</li>
              </ul>
            </section>
            <section><h2 className="text-xl font-semibold text-foreground mb-3">How to Cancel</h2><p>Cancel through your My Bookings page or contact our support team at info.ronakenterprise@gmail.com or +91 99040 89393.</p></section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
