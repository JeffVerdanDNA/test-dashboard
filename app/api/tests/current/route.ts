import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/tests/current`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Nenhum teste em execução' },
          { status: 404 }
        )
      }
      throw new Error('Falha ao buscar teste atual')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao buscar teste atual:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar teste atual' },
      { status: 500 }
    )
  }
}
