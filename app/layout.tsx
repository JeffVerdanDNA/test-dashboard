import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Genomatech Test Dashboard',
  description: 'Dashboard de testes automatizados para plataforma Genomatech',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
