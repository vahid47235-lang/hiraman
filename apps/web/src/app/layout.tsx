import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://lootka.ir'),
  title: {
    template: '%s | LOOTKA لوتکا',
    default: 'LOOTKA لوتکا — Nature, Wellness & Adventure Resort',
  },
  description: 'Luxury forest resort in northern Iran. Private cabins, private pools, wellness, family experiences and adventure in the Hyrcanian forest.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
