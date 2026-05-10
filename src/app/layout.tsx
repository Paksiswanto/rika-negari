import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1de264', 
}

export const metadata: Metadata = {
  title: {
    default: 'Rika Negari Property - Partner Hunian Terpercaya Sidoarjo & Surabaya',
    template: '%s | Rika Negari Property'
  },
  description:
    'Cari rumah impian di Sidoarjo & Surabaya? Rika Negari menyediakan katalog perumahan premium dari developer terpercaya. Legalitas aman, proses KPR didampingi hingga ACC.',
  keywords: ['agen properti sidoarjo', 'rumah murah surabaya', 'kredit rumah sidoarjo', 'grand sentosa land', 'green mansion juanda'],
  
  openGraph: {
    title: 'Rika Negari Property — Partner Hunian Terpercaya Jawa Timur',
    description: 'Temukan unit perumahan terbaik dengan harga transparan dan bantuan KPR hingga tuntas.',
    url: 'https://rika-negari-kappa.vercel.app/', 
    siteName: 'Rika Negari Property',
    locale: 'id_ID',
    type: 'website',
    
  },
  
  alternates: {
    canonical: '/',
  },
  
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        WebkitFontSmoothing: 'antialiased', 
        MozOsxFontSmoothing: 'grayscale' 
      }}>
        {children}
      </body>
    </html>
  )
}