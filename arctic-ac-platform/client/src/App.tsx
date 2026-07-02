import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Customer pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import BookingConfirmation from "./pages/BookingConfirmation";
import TrackBooking from "./pages/TrackBooking";
import MyBookings from "./pages/MyBookings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cancellation from "./pages/Cancellation";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminTechnicians from "./pages/admin/AdminTechnicians";
import AdminServices from "./pages/admin/AdminServices";
import AdminZones from "./pages/admin/AdminZones";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminMap from "./pages/admin/AdminMap";

// Technician pages
import TechLogin from "./pages/technician/TechLogin";
import TechDashboard from "./pages/technician/TechDashboard";
import TechJobDetail from "./pages/technician/TechJobDetail";
import TechHistory from "./pages/technician/TechHistory";

function Router() {
  return (
    <Switch>
      {/* Customer */}
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/book" component={Booking} />
      <Route path="/booking/confirmation/:ref" component={BookingConfirmation} />
      <Route path="/track/:ref" component={TrackBooking} />
      <Route path="/my-bookings" component={MyBookings} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/cancellation" component={Cancellation} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

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
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
