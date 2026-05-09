import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prima Properti — Hunian Premium Jawa Timur',
  description:
    'Temukan rumah impian Anda bersama Prima Properti. Perumahan premium dengan lokasi strategis, legalitas lengkap, dan harga transparan di Sidoarjo & Surabaya.',
  keywords: 'properti, perumahan, rumah, Sidoarjo, Surabaya, KPR, hunian premium',
  openGraph: {
    title: 'Prima Properti — Hunian Premium Jawa Timur',
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
