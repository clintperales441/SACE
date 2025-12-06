import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import TeamSection from '@/components/landing/TeamSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <TeamSection />
    </Layout>
  );
};

export default Index;
