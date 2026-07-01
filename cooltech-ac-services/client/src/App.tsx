import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Booking from "./pages/Booking";
import BookingConfirmation from "./pages/BookingConfirmation";
import TechnicianLocator from "./pages/TechnicianLocator";
import LiveTracking from "./pages/LiveTracking";
import TechnicianProfile from "./pages/TechnicianProfile";
import Account from "./pages/Account";
import BookingHistory from "./pages/BookingHistory";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/services/:slug" component={ServiceDetail} />
      <Route path="/book" component={Booking} />
      <Route path="/book/:serviceId" component={Booking} />
      <Route path="/booking-confirmation/:bookingId" component={BookingConfirmation} />
      <Route path="/technicians" component={TechnicianLocator} />
      <Route path="/technicians/:id" component={TechnicianProfile} />
      <Route path="/tracking/:bookingId" component={LiveTracking} />
      <Route path="/account" component={Account} />
      <Route path="/bookings" component={BookingHistory} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
