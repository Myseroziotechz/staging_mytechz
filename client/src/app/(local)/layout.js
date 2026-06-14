import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingAIChat from '@/components/ai/FloatingAIChat'

export default function LocalLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <FloatingAIChat />
    </>
  )
}
