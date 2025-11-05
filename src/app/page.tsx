import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to default locale landing page
  redirect('/en/landing')
}
