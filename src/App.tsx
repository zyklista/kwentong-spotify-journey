import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ScrollToTop from "@/components/ScrollToTop";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OurStory = lazy(() => import("./pages/OurStory"));
const BlogPosts = lazy(() => import("./pages/BlogPosts"));
const Connect = lazy(() => import("./pages/Connect"));
const ContactFormPage = lazy(() => import("./pages/ContactFormPage"));
const EbookSignupPage = lazy(() => import("./pages/EbookSignupPage"));

// Lazy load blog components
const StartingYourJourney = lazy(() => import("./pages/blog/StartingYourJourney"));
const HandlingHomesickness = lazy(() => import("./pages/blog/HandlingHomesickness"));
const FinancialPlanning = lazy(() => import("./pages/blog/FinancialPlanning"));
const SkillsDevelopment = lazy(() => import("./pages/blog/SkillsDevelopment"));
const StayingConnected = lazy(() => import("./pages/blog/StayingConnected"));
const CulturalAdaptation = lazy(() => import("./pages/blog/CulturalAdaptation"));
const Entrepreneurship = lazy(() => import("./pages/blog/Entrepreneurship"));
const HealthcareHeroes = lazy(() => import("./pages/blog/HealthcareHeroes"));
const WorkLifeBalance = lazy(() => import("./pages/blog/WorkLifeBalance"));
const ComingHome = lazy(() => import("./pages/blog/ComingHome"));
const CareerGrowth = lazy(() => import("./pages/blog/CareerGrowth"));
const LegalGuide = lazy(() => import("./pages/blog/LegalGuide"));
const MentalHealth = lazy(() => import("./pages/blog/MentalHealth"));
const LanguageLearning = lazy(() => import("./pages/blog/LanguageLearning"));
const MiddleEastSuccessStories = lazy(() => import("./pages/blog/MiddleEastSuccessStories"));
const EmergencyFund = lazy(() => import("./pages/blog/EmergencyFund"));
const SeasonalWork = lazy(() => import("./pages/blog/SeasonalWork"));
const FamilyDynamics = lazy(() => import("./pages/blog/FamilyDynamics"));
const Survey = lazy(() => import("./pages/Survey"));

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Configure React Query with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop behavior="smooth" />
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
