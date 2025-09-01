import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
const ReviewsSection = () => {
  const reviews = [{
    id: 1,
    name: "Maria Santos",
    rating: 5,
    review: "The guidance I received helped me navigate my career transition successfully. Highly recommend their services!",
    location: "Dubai, UAE"
  }, {
    id: 2,
    name: "Juan dela Cruz",
    rating: 5,
    review: "Amazing support and resources for OFWs. The team really understands what we go through.",
    location: "Singapore"
  }, {
    id: 3,
    name: "Anna Rodriguez",
    rating: 4,
    review: "Great content and advice. The podcast episodes are particularly helpful for mental health support.",
    location: "Hong Kong"
  }, {
    id: 4,
    name: "Carlos Mendoza",
    rating: 5,
    review: "Excellent service! They helped me with legal documentation and career planning. Very professional.",
    location: "Saudi Arabia"
  }, {
    id: 5,
    name: "Sofia Garcia",
    rating: 5,
    review: "The financial planning advice saved me thousands. Worth every penny of their consultation fee.",
    location: "Canada"
  }, {
    id: 6,
    name: "Rico Fernandez",
    rating: 4,
    review: "Good resources for entrepreneurship. Helped me start my own business while working abroad.",
    location: "Australia"
  }];
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, index) => <Star key={index} className={`w-4 h-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />);
  };
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return <section className="py-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Client Reviews
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            {renderStars(Math.round(averageRating))}
            <span className="text-xl font-semibold ml-2">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviews.length} reviews)</span>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Trusted by OFWs worldwide for guidance, support, and professional services.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {reviews.map(review => <Card key={review.id} className="p-6 shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                {renderStars(review.rating)}
              </div>
              <div className="border-t pt-4">
                <p className="font-semibold">{review.name}</p>
                <p className="text-sm text-muted-foreground">{review.location}</p>
              </div>
            </Card>)}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-4">
            Ready to join our satisfied clients?
          </p>
          <a href="#contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
            Get Started Today
            <Star className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>;
};
export default ReviewsSection;