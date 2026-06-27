import type { Metadata } from 'next'
import ReserveClient from './ReserveClient'

type Props = { params: Promise<{ locale: string }> }

export default async function ReservePage({ params }: Props) {
  const { locale } = await params
  return <ReserveClient locale={locale} />
}
