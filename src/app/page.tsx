export const revalidate = 10800
export const dynamic = 'force-dynamic'


import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WAButton from '@/components/ui/WAButton'
import HeroSection from '@/components/sections/HeroSection'
import AnnouncementStrip from '@/components/sections/AnnouncementStrip'
import FeaturedProperties from '@/components/sections/FeaturedProperties'
import AboutSection from '@/components/sections/AboutSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AnnouncementStrip />
        <FeaturedProperties />
        <AboutSection />
        <TestimonialsSection />
      </main>
      <Footer />
      <WAButton />
    </>
  )
}
