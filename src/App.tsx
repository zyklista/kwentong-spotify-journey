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
          <Route path="/connect" element={<Connect />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
