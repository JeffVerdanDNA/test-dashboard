import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/tests`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Falha ao buscar testes')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao buscar testes:', error)
    return NextResponse.json(
      { tests: [], total: 0 },
      { status: 200 }
    )
  }
}
