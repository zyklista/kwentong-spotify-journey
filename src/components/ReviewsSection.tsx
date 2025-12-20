import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
const ReviewsSection = () => {
  const isMobile = useIsMobile();
  
  // Reviews data with messages
    const [reviews, setReviews] = useState<any[]>([]);
    useEffect(() => {
      const fetchReviews = async () => {
        const { data, error } = await supabase
          .from('survey_responses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        if (!error && data) {
          setReviews(data);
        }
      };
      fetchReviews();
    }, []);
  
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, index) => <Star key={index} className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />);
  };
  
    const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  
  return <section className="bg-gradient-to-b from-white to-slate-50 py-16 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className={`text-center ${isMobile ? 'mb-10' : 'mb-16'}`}>
          <div className={`inline-flex items-center gap-2 bg-primary/15 text-primary rounded-full font-bold mb-6 ${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'}`}>
            <Star className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            Client Reviews
          </div>
          <div className={`flex items-center justify-center gap-3 mb-6 ${isMobile ? 'flex-col' : ''}`}>
            <div className="flex gap-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className={`flex items-center gap-3 ${isMobile ? 'mt-2' : 'ml-2'}`}>
              <span className={`font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{averageRating.toFixed(1)}</span>
              <span className="text-gray-600 font-medium">({reviews.length} reviews)</span>
            </div>
          </div>
            <p className={`text-gray-600 mx-auto leading-relaxed ${isMobile ? 'text-base max-w-sm' : 'text-xl max-w-3xl'}`}>
              Read what our community members have to say about their experiences and the support they've received.
            </p>
        </div>

        {/* Reviews List - one line, fit messages */}
        <div className="flex flex-row justify-center items-stretch gap-4 max-w-6xl mx-auto overflow-x-auto">
          {reviews.length === 0 ? (
            <div className="text-muted-foreground text-center w-full py-8">No reviews yet. Be the first to leave feedback!</div>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} className="flex-1 min-w-[280px] max-w-xs p-4 shadow-none bg-transparent border border-gray-200 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-primary">{review.name}</span>
                </div>
                <div className="flex gap-1 mb-1">
                  {renderStars(review.rating)}
                </div>
                <p className={`text-muted-foreground mx-auto leading-relaxed ${isMobile ? 'text-base max-w-sm' : 'text-xl max-w-3xl'} whitespace-normal break-words`}>
                  {review.feedback}
                </p>
              </Card>
            ))
          )}
        </div>

        {/* Rate Us Button */}
        <div className="flex justify-center mt-8">
          <Link to="/survey">
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-8 py-3 rounded-full text-lg shadow transition">
              Leave a Review
            </button>
          </Link>
        </div>

          {/* Reviews note added above. No call to action below. */}
      </div>
    </section>;
};
export default ReviewsSection;