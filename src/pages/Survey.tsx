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
      
      <main className={`container mx-auto ${isMobile ? 'px-4 py-8' : 'px-6 py-12'}`}>
        {/* Page Header */}
        <div className={`text-center mb-8 ${isMobile ? 'mb-6' : ''}`}>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-foreground mb-4`}>
            Customer Feedback Survey
          </h1>
          <p className={`text-muted-foreground max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-lg'}`}>
            We value your opinion! Help us improve our services by sharing your feedback and experience.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={`flex justify-center mb-8 ${isMobile ? 'mb-6' : ''}`}>
          <div className="bg-secondary rounded-lg p-1 inline-flex">
            <Button
              variant={activeTab === 'form' ? 'default' : 'ghost'}
              size={isMobile ? 'sm' : 'default'}
              onClick={() => setActiveTab('form')}
              className={`${isMobile ? 'text-xs px-3' : 'px-6'}`}
            >
              Submit Feedback
            </Button>
            <Button
              variant={activeTab === 'responses' ? 'default' : 'ghost'}
              size={isMobile ? 'sm' : 'default'}
              onClick={() => setActiveTab('responses')}
              className={`${isMobile ? 'text-xs px-3' : 'px-6'}`}
            >
              View Responses
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[500px]">
          {activeTab === 'form' ? (
            <div className="flex justify-center">
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