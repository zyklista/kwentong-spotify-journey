import { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SurveyWidget from "@/components/SurveyWidget";
import SurveyResponses from "@/components/SurveyResponses";
import { useIsMobile } from "@/hooks/use-mobile";

const Survey = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'form' | 'responses'>('form');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className={`container mx-auto ${isMobile ? 'px-4 py-16' : 'px-6 py-24'}`}>
        {/* Page Header */}
        <div className={`text-center mb-8 ${isMobile ? 'mb-6' : ''}`}>
          <h1 className="font-bold text-foreground text-3xl md:text-4xl max-w-4xl px-4 mx-auto break-words flex justify-center items-center text-center mb-4">
            Tell us how can we improve
          </h1>
          <p className={`text-muted-foreground mx-auto ${isMobile ? 'text-xs max-w-xs' : 'text-base max-w-lg'} break-words`}>
            We value your opinion! Help us improve our services by sharing your feedback and experience.
          </p>
          {/* Add navigation buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant={activeTab === "form" ? "default" : "outline"}
              onClick={() => setActiveTab("form")}
            >
              Submit Feedback
            </Button>
            <Button
              variant={activeTab === "responses" ? "default" : "outline"}
              onClick={() => setActiveTab("responses")}
            >
              Review Responses
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[500px]">
          {activeTab === 'form' ? (
            <div className="flex justify-center mt-12">
              <SurveyWidget />
            </div>
          ) : (
            <SurveyResponses />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Survey;
