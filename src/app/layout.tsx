import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rika-Negari - Menempatkan Rumah Impian Anda',
  description:
    'Temukan rumah impian Anda bersama Rika-Negari. Perumahan premium dengan lokasi strategis, legalitas lengkap, dan harga transparan di Sidoarjo & Surabaya.',
  keywords: 'properti, perumahan, rumah, Sidoarjo, Surabaya, KPR, hunian premium',
  openGraph: {
    title: 'Rika-Negari — Hunian Premium Jawa Timur',
    description: 'Perumahan premium dengan lokasi strategis dan harga transparan.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
