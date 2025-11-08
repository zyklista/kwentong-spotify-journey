import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OurStory from "./pages/OurStory";
import BlogPosts from "./pages/BlogPosts";
import Connect from "./pages/Connect";
import ContactFormPage from "./pages/ContactFormPage";
import EbookSignupPage from "./pages/EbookSignupPage";
import StartingYourJourney from "./pages/blog/StartingYourJourney";
import HandlingHomesickness from "./pages/blog/HandlingHomesickness";
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
import LanguageLearning from "./pages/blog/LanguageLearning";
import MiddleEastSuccessStories from "./pages/blog/MiddleEastSuccessStories";
import EmergencyFund from "./pages/blog/EmergencyFund";
import SeasonalWork from "./pages/blog/SeasonalWork";
import FamilyDynamics from "./pages/blog/FamilyDynamics";
import Survey from "./pages/Survey";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop behavior="smooth" />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/blog" element={<BlogPosts />} />
          <Route path="/blog/starting-your-journey" element={<StartingYourJourney />} />
          <Route path="/blog/handling-homesickness" element={<HandlingHomesickness />} />
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
          <Route path="/blog/language-learning" element={<LanguageLearning />} />
          <Route path="/blog/middle-east-success-stories" element={<MiddleEastSuccessStories />} />
          <Route path="/blog/emergency-fund" element={<EmergencyFund />} />
          <Route path="/blog/seasonal-work" element={<SeasonalWork />} />
          <Route path="/blog/family-dynamics" element={<FamilyDynamics />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/contact" element={<ContactFormPage />} />
          <Route path="/ebook" element={<EbookSignupPage />} />
          <Route path="/survey" element={<Survey />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
