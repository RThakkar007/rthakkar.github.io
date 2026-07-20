import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WhatsAppCTA } from "./components/WhatsAppCTA";
import { FloatingBookNow } from "./components/FloatingBookNow";

const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Booking = lazy(() => import("./pages/Booking"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const TechnicianLocator = lazy(() => import("./pages/TechnicianLocator"));
const LiveTracking = lazy(() => import("./pages/LiveTracking"));
const TechnicianProfile = lazy(() => import("./pages/TechnicianProfile"));
const Account = lazy(() => import("./pages/Account"));
const BookingHistory = lazy(() => import("./pages/BookingHistory"));

function Router() {
  return (
    <Suspense fallback={<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0f172a"}}><div style={{width:40,height:40,border:"3px solid #22d3ee",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}} /></div>}>
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
    </Suspense>
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
          <WhatsAppCTA />
          <FloatingBookNow />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
