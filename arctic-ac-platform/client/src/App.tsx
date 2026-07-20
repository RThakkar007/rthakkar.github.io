import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Router as WouterRouter } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { WhatsAppCTA } from "./components/WhatsAppCTA";
import { PageLoader } from "./components/PageLoader";
import { FloatingBookNow } from "./components/FloatingBookNow";

// ── Lazy-loaded routes (code splitting — only load what the user visits) ──────
// Customer pages
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const Booking = lazy(() => import("./pages/Booking"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const TrackBooking = lazy(() => import("./pages/TrackBooking"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cancellation = lazy(() => import("./pages/Cancellation"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Technicians = lazy(() => import("./pages/Technicians"));
// Admin pages (heavy — only loaded when admin visits /admin/*)
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminTechnicians = lazy(() => import("./pages/admin/AdminTechnicians"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminZones = lazy(() => import("./pages/admin/AdminZones"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminMap = lazy(() => import("./pages/admin/AdminMap"));
// Technician pages
const TechLogin = lazy(() => import("./pages/technician/TechLogin"));
const TechDashboard = lazy(() => import("./pages/technician/TechDashboard"));
const TechJobDetail = lazy(() => import("./pages/technician/TechJobDetail"));
const TechHistory = lazy(() => import("./pages/technician/TechHistory"));

// ── Page skeleton fallback ────────────────────────────────────────────────────
function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Customer */}
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/book" component={Booking} />
        <Route path="/booking/confirmation/:ref" component={BookingConfirmation} />
        <Route path="/track/:ref" component={TrackBooking} />
        <Route path="/my-bookings" component={MyBookings} />
        <Route path="/technicians" component={Technicians} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/cancellation" component={Cancellation} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        {/* Admin */}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/bookings" component={AdminBookings} />
        <Route path="/admin/technicians" component={AdminTechnicians} />
        <Route path="/admin/services" component={AdminServices} />
        <Route path="/admin/zones" component={AdminZones} />
        <Route path="/admin/payments" component={AdminPayments} />
        <Route path="/admin/analytics" component={AdminAnalytics} />
        <Route path="/admin/map" component={AdminMap} />
        {/* Technician */}
        <Route path="/tech/login" component={TechLogin} />
        <Route path="/tech/dashboard" component={TechDashboard} />
        <Route path="/tech/job/:id" component={TechJobDetail} />
        <Route path="/tech/history" component={TechHistory} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <WouterRouter>
              <Router />
            </WouterRouter>
            <WhatsAppCTA />
            <FloatingBookNow />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
