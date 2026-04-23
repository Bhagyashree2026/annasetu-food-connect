import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Splash from "./pages/app/Splash.tsx";
import Login from "./pages/app/Login.tsx";
import RoleSelect from "./pages/app/RoleSelect.tsx";
import Home from "./pages/app/Home.tsx";
import Donate from "./pages/app/Donate.tsx";
import Match from "./pages/app/Match.tsx";
import Track from "./pages/app/Track.tsx";
import Nearby from "./pages/app/Nearby.tsx";
import Pickup from "./pages/app/Pickup.tsx";
import Donations from "./pages/app/Donations.tsx";
import Notifications from "./pages/app/Notifications.tsx";
import Impact from "./pages/app/Impact.tsx";
import Profile from "./pages/app/Profile.tsx";
import Admin from "./pages/app/Admin.tsx";
import Community from "./pages/app/Community.tsx";
import Search from "./pages/app/Search.tsx";
import MemberProfile from "./pages/app/MemberProfile.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/index" element={<Index />} />
          <Route path="/app" element={<Splash />} />
          <Route path="/app/login" element={<Login />} />
          <Route path="/app/role" element={<RoleSelect />} />
          <Route path="/app/home" element={<Home />} />
          <Route path="/app/donate" element={<Donate />} />
          <Route path="/app/match/:id" element={<Match />} />
          <Route path="/app/track/:id" element={<Track />} />
          <Route path="/app/nearby" element={<Nearby />} />
          <Route path="/app/pickup/:id" element={<Pickup />} />
          <Route path="/app/donations" element={<Donations />} />
          <Route path="/app/notifications" element={<Notifications />} />
          <Route path="/app/impact" element={<Impact />} />
          <Route path="/app/profile" element={<Profile />} />
          <Route path="/app/admin" element={<Admin />} />
          <Route path="/app/community" element={<Community />} />
          <Route path="/app/search" element={<Search />} />
          <Route path="/app/profile/:id" element={<MemberProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
