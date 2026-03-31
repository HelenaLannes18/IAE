import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MentorsGrid from '@/components/MentorsGrid';
import MapStats from '@/components/MapStats';
import MissionValues from '@/components/MissionValues';
import VideoSection from '@/components/VideoSection';
import EventsFormats from '@/components/EventsFormats';
import IfYouToGet from '@/components/IfYouToGet';
import PhotoGallery from '@/components/PhotoGallery';
import EcosystemBentoGrid from '@/components/EcosystemBentoGrid';
import ApplicationForm from '@/components/ApplicationForm';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuemSomos from '@/components/QuemSomos';
import EducacaoExecutiva from '@/components/EducacaoExecutiva';
import Hero2 from '@/components/Hero2';
import BlogSection from '@/components/BlogSection';

export default function BoardLandingPage() {
  return (
    // Fundo Off-White, texto Marrom Escuro, e seleção Azul Profundo
    <div className="min-h-screen bg-[#F3F1EC] text-[#3A3733] font-sans selection:bg-[#16243A] selection:text-[#F3F1EC] overflow-x-hidden relative">
      <Header />
      <main className="pt-24">
        <Hero2 />
        <QuemSomos />
        <MentorsGrid />
        {/* <MapStats /> */}
        <MissionValues />
        <VideoSection />
        <EventsFormats />
        <IfYouToGet />
        <EducacaoExecutiva />
        <PhotoGallery />
        <BlogSection />
        {/* <EcosystemBentoGrid /> */}
        <ApplicationForm />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}