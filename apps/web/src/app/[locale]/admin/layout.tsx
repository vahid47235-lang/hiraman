// Admin sub-layout — intentionally strips the site header/footer.
// This is a slot layout trick: we render children inside a bare div,
// but the parent [locale]/layout.tsx still wraps with <html>/<body>.
// The Header/Footer from the parent layout are hidden via CSS on this route.

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lootka Admin',
  robots: { index: false, follow: false },
}

export default function AdminSubLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* Hide site chrome on /admin routes */
        header, footer, [data-floating-actions], [data-cookie-consent] {
          display: none !important;
        }
        body { background: #f5f5f4 !important; }
        #main-content { padding: 0 !important; }
      `}</style>
      <div style={{ minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </div>
    </>
  )
}
