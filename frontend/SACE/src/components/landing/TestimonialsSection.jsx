import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    statement: "SACE transformed how our team writes requirements. The AI feedback is incredibly accurate and saves us hours of review time.",
    name: "Sarah Chen",
    school: "Stanford University",
  },
  {
    statement: "As an instructor, I've seen my students' SRS quality improve dramatically.",
    name: "Dr. Michael Roberts",
    school: "MIT",
  },
  {
    statement: "The compliance checking feature alone is worth it. We caught issues that would have been costly to fix later in development.",
    name: "James Wilson",
    school: "Carnegie Mellon University",
  },
  {
    statement: "Finally, a tool that understands the nuances of software requirements. SACE is now essential to our curriculum.",
    name: "Prof. Emily Zhang",
    school: "UC Berkeley",
  },
  {
    statement: "The instant feedback loop helped me improve my technical writing skills faster than any course I've taken.",
    name: "Alex Thompson",
    school: "Georgia Tech",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-peach/20 rounded-full blur-3xl" />
      
      <div className="container-main relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <Quote className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            What Our Users Say
          </h2>
        </div>

        {/* Testimonial card */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Navigation arrows */}
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-10 rounded-full bg-card shadow-md hover:shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-10 rounded-full bg-card shadow-md hover:shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Card */}
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card text-center">
              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 italic">
                "{testimonials[currentIndex].statement}"
              </p>
              
              <div>
                <p className="font-display font-semibold text-foreground">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {testimonials[currentIndex].school}
                </p>
              </div>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary w-8' 
                    : 'bg-border hover:bg-muted-foreground'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
