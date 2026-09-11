'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import NoticeCarousel from '@/components/NoticeCarousel';
import AboutSection from '@/components/AboutSection';
import FleetCarousel from '@/components/FleetCarousel';
import ServicesSection from '@/components/ServicesSection';
import BasesGrid from '@/components/BasesGrid';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import AdminGearButton from '@/components/AdminGearButton';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteContent, SectionOrderItem } from '@/lib/api';
import { CommoditiesTestTicker } from '@/components/OilTracker';
import BannerCarousel from '@/components/BannerCarousel';

const DEFAULT_SECTIONS: SectionOrderItem[] = [
  { id: 'hero', name: 'Seção Inicial (Hero)', enabled: true, order: 1 },
  { id: 'notices', name: 'Quadro de Avisos & Notícias', enabled: true, order: 2 },
  { id: 'about', name: 'A Empresa & Métricas', enabled: true, order: 3 },
  { id: 'fleet', name: 'Nossa Frota', enabled: true, order: 4 },
  { id: 'services', name: 'Produtos e Serviços', enabled: true, order: 5 },
  { id: 'bases', name: 'Bases Operacionais & Mapa', enabled: true, order: 6 },
  { id: 'contact', name: 'Contato & Atendimento', enabled: true, order: 7 },
];

const SECTION_COMPONENTS: Record<string, React.ReactNode> = {
  hero: <HeroSection key="hero" />,
  notices: <NoticeCarousel key="notices" />,
  about: <AboutSection key="about" />,
  fleet: <FleetCarousel key="fleet" />,
  services: <ServicesSection key="services" />,
  bases: <BasesGrid key="bases" />,
  contact: <ContactSection key="contact" />,
};

export default function Home() {
  const { data: sectionsOrder } = useQuery({
    queryKey: ['sectionsOrder'],
    queryFn: async () => {
      const data = await fetchSiteContent('sections_order');
      if (Array.isArray(data) && data.length > 0) {
        return data as SectionOrderItem[];
      }
      return DEFAULT_SECTIONS;
    },
    staleTime: 1000 * 60 * 2,
  });

  const activeSections = (sectionsOrder || DEFAULT_SECTIONS)
    .filter((sec) => sec.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (  
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans relative">
      <ScrollProgressBar />
      <Navbar />

      {/* Banner Principal com Carrossel Automático */}
      <BannerCarousel />

      <main className="flex-1">
        {activeSections.map((sec) => SECTION_COMPONENTS[sec.id] || null)}
      </main>
      

      <CommoditiesTestTicker />
      <Footer />
      <FloatingWhatsApp />
      <AdminGearButton />


    </div>
  );
}
