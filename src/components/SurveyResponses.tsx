import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";

interface SurveyResponse {
  id: string;
  name: string | null;
  email: string;
  rating: number;
  feedback: string;
  created_at: string;
}

const SurveyResponses = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setResponses(data || []);
    } catch (error: any) {
      console.error('Error fetching survey responses:', error);
      toast({
        title: "Error Loading Responses",
        description: "Failed to load survey responses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();

    // Set up real-time subscription for new responses
    const channel = supabase
      .channel('survey-responses-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'survey_responses'
        },
        (payload) => {
          console.log('New survey response:', payload);
          setResponses(current => [payload.new as SurveyResponse, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy at h:mm a');
    } catch {
      return 'Unknown date';
    }
  };

  if (loading) {
    return (
      <div className={`w-full max-w-4xl mx-auto ${isMobile ? 'px-4' : ''}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading survey responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto ${isMobile ? 'px-4' : ''}`}>
      <div className={`text-center mb-8 ${isMobile ? 'mb-6' : ''}`}>
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground mb-2`}>
          Survey Responses
        </h2>
        <p className="text-muted-foreground">
          {responses.length} {responses.length === 1 ? 'response' : 'responses'} received
        </p>
      </div>

      {responses.length === 0 ? (
        <Card>
          <CardContent className={`text-center ${isMobile ? 'p-4' : 'p-8'}`}>
            <User className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} mx-auto text-muted-foreground mb-4`} />
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-foreground mb-2`}>
              No Responses Yet
            </h3>
            <p className="text-muted-foreground">
              Be the first to share your feedback!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={`space-y-4 ${isMobile ? 'space-y-3' : ''}`}>
          {responses.map((response) => (
            <Card key={response.id} className="transition-shadow hover:shadow-md">
              <CardHeader className={`${isMobile ? 'p-4 pb-2' : 'pb-3'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>
                      {response.name || "Anonymous"}
                    </CardTitle>
                    <CardDescription className={`${isMobile ? 'text-xs' : 'text-sm'} mt-1`}>
                      {formatDate(response.created_at)}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`flex items-center gap-1 ${isMobile ? 'text-xs px-2 py-0.5' : ''}`}
                  >
                    {renderStars(response.rating)}
                    <span className="ml-1">{response.rating}/5</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className={`${isMobile ? 'p-4 pt-0' : 'pt-0'}`}>
                <p className={`text-foreground leading-relaxed ${isMobile ? 'text-sm' : ''}`}>
                  {response.feedback}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyResponses;
