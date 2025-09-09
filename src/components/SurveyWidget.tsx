import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface SurveyFormData {
  name: string;
  email: string;
  rating: number;
  feedback: string;
}

const SurveyWidget = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState<SurveyFormData>({
    name: "",
    email: "",
    rating: 0,
    feedback: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.email || !validateEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (formData.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating from 1 to 5 stars.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please provide your feedback.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('survey_responses')
        .insert([{
          name: formData.name.trim() || null,
          email: formData.email.trim(),
          rating: formData.rating,
          feedback: formData.feedback.trim(),
        }]);

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      toast({
        title: "Survey Submitted!",
        description: "Thank you for your feedback. We appreciate your input!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        rating: 0,
        feedback: "",
      });
    } catch (error: any) {
      console.error('Survey submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      return (
        <button
          key={starNumber}
          type="button"
          onClick={() => handleRatingClick(starNumber)}
          className={`${isMobile ? 'p-1' : 'p-2'} rounded transition-colors hover:bg-secondary/50`}
        >
          <Star
            className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} ${
              starNumber <= formData.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground hover:text-yellow-400"
            }`}
          />
        </button>
      );
    });
  };

  if (isSuccess) {
    return (
      <Card className={`w-full max-w-2xl mx-auto ${isMobile ? 'mx-4' : ''}`}>
        <CardContent className={`text-center ${isMobile ? 'p-4' : 'p-8'}`}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 fill-green-500 text-green-500" />
            </div>
          </div>
          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-foreground mb-2`}>
            Thank You!
          </h3>
          <p className="text-muted-foreground mb-4">
            Your feedback has been submitted successfully. We appreciate your input!
          </p>
          <Button 
            onClick={() => setIsSuccess(false)}
            variant="outline"
            size={isMobile ? "sm" : "default"}
          >
            Submit Another Response
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-2xl mx-auto ${isMobile ? 'mx-4' : ''}`}>
      <CardHeader className={isMobile ? 'p-4 pb-2' : ''}>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} text-center`}>
          Share Your Feedback
        </CardTitle>
        <CardDescription className="text-center">
          Help us improve by sharing your experience with our services
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'p-4 pt-2' : ''}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="name" className={isMobile ? 'text-sm' : ''}>
              Full Name <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={isMobile ? 'text-sm' : ''}
            />
          </div>

          {/* Email Field (Required) */}
          <div className="space-y-2">
            <Label htmlFor="email" className={isMobile ? 'text-sm' : ''}>
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
              className={isMobile ? 'text-sm' : ''}
            />
          </div>

          {/* Rating Field (Required) */}
          <div className="space-y-2">
            <Label className={isMobile ? 'text-sm' : ''}>
              Rating <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-1">
              {renderStars()}
              {formData.rating > 0 && (
                <span className={`ml-2 text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
                  {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Feedback Field (Required) */}
          <div className="space-y-2">
            <Label htmlFor="feedback" className={isMobile ? 'text-sm' : ''}>
              Feedback <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleInputChange}
              placeholder="Please share your feedback, suggestions, or experience..."
              required
              rows={isMobile ? 3 : 4}
              className={isMobile ? 'text-sm' : ''}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
            size={isMobile ? "sm" : "default"}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SurveyWidget;