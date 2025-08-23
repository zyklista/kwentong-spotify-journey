import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OurStory from "./pages/OurStory";
import BlogPosts from "./pages/BlogPosts";
import Connect from "./pages/Connect";
import StartingYourJourney from "./pages/blog/StartingYourJourney";
import SuccessStoriesCzech from "./pages/blog/SuccessStoriesCzech";
import FinancialPlanning from "./pages/blog/FinancialPlanning";
import SkillsDevelopment from "./pages/blog/SkillsDevelopment";
import StayingConnected from "./pages/blog/StayingConnected";
import CulturalAdaptation from "./pages/blog/CulturalAdaptation";
import Entrepreneurship from "./pages/blog/Entrepreneurship";
import HealthcareHeroes from "./pages/blog/HealthcareHeroes";
import WorkLifeBalance from "./pages/blog/WorkLifeBalance";
import ComingHome from "./pages/blog/ComingHome";
import CareerGrowth from "./pages/blog/CareerGrowth";
import LegalGuide from "./pages/blog/LegalGuide";
import MentalHealth from "./pages/blog/MentalHealth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/blog" element={<BlogPosts />} />
          <Route path="/blog/starting-your-journey" element={<StartingYourJourney />} />
          <Route path="/blog/success-stories-czech" element={<SuccessStoriesCzech />} />
          <Route path="/blog/financial-planning" element={<FinancialPlanning />} />
          <Route path="/blog/skills-development" element={<SkillsDevelopment />} />
          <Route path="/blog/staying-connected" element={<StayingConnected />} />
          <Route path="/blog/cultural-adaptation" element={<CulturalAdaptation />} />
          <Route path="/blog/entrepreneurship" element={<Entrepreneurship />} />
          <Route path="/blog/healthcare-heroes" element={<HealthcareHeroes />} />
          <Route path="/blog/work-life-balance" element={<WorkLifeBalance />} />
          <Route path="/blog/coming-home" element={<ComingHome />} />
          <Route path="/blog/career-growth" element={<CareerGrowth />} />
          <Route path="/blog/legal-guide" element={<LegalGuide />} />
          <Route path="/blog/mental-health" element={<MentalHealth />} />
          <Route path="/connect" element={<Connect />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
