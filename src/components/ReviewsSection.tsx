import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
const ReviewsSection = () => {
  const isMobile = useIsMobile();
  
  // Keep only the ratings data without review text
  const reviews = [{
    id: 1,
    name: "Maria Santos",
    rating: 5,
    location: "Dubai, UAE"
  }, {
    id: 2,
    name: "Juan dela Cruz",
    rating: 5,
    location: "Singapore"
  }, {
    id: 3,
    name: "Anna Rodriguez",
    rating: 4,
    location: "Hong Kong"
  }, {
    id: 4,
    name: "Carlos Mendoza",
    rating: 5,
    location: "Saudi Arabia"
  }, {
    id: 5,
    name: "Sofia Garcia",
    rating: 5,
    location: "Canada"
  }, {
    id: 6,
    name: "Rico Fernandez",
    rating: 4,
    location: "Australia"
  }];
  
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, index) => <Star key={index} className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />);
  };
  
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  return <section className={`bg-gradient-to-t from-secondary/20 to-background/5 ${isMobile ? 'py-12' : 'py-20'} relative overflow-hidden`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className={`text-center ${isMobile ? 'mb-8' : 'mb-16'}`}>
          <div className={`inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full font-medium mb-4 ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}>
            <Star className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            Client Reviews
          </div>
          <div className={`flex items-center justify-center gap-2 mb-4 ${isMobile ? 'flex-col' : ''}`}>
            <div className="flex gap-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className={`flex items-center gap-2 ${isMobile ? 'mt-2' : 'ml-2'}`}>
              <span className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'}`}>{averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviews.length} reviews)</span>
            </div>
          </div>
          <p className={`text-muted-foreground mx-auto leading-relaxed ${isMobile ? 'text-base max-w-sm' : 'text-xl max-w-3xl'}`}>
            Trusted by OFWs worldwide for guidance, support, and professional services.
          </p>
        </div>

        {/* Call to Action */}
        <div className={`text-center ${isMobile ? 'mt-8' : 'mt-12'}`}>
          <p className={`text-muted-foreground mb-4 ${isMobile ? 'text-base' : 'text-lg'}`}>
            Ready to join our satisfied clients?
          </p>
          <a href="/survey" className={`inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold rounded-full transition-colors ${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'}`}> 
            Help Us Improve
            <Star className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
          </a>
        </div>
      </div>
    </section>;
};
export default ReviewsSection;