'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TestResult } from '@/types/test'

interface TestChartProps {
  testHistory: TestResult[]
}

export default function TestChart({ testHistory }: TestChartProps) {
  // Preparar dados para o gráfico
  const chartData = testHistory
    .slice(-10) // Últimos 10 testes
    .map(test => ({
      date: format(parseISO(test.timestamp), 'dd/MM HH:mm', { locale: ptBR }),
      erros: test.resumo?.total_erros || 0,
      abas: test.resumo?.total_abas_testadas || 0,
      sucesso: test.resumo?.abas_com_sucesso || 0,
    }))

  return (
    <div className="card mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Histórico de Testes
          </h2>
          <p className="text-slate-400 text-sm">
            Últimos 10 testes executados
          </p>
        </div>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#fff'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
            />
            <Line 
              type="monotone" 
              dataKey="abas" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Abas Testadas"
              dot={{ fill: '#3b82f6', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="sucesso" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Sucessos"
              dot={{ fill: '#10b981', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="erros" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Erros"
              dot={{ fill: '#ef4444', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-slate-400">
            Nenhum teste executado ainda
          </p>
        </div>
      )}
    </div>
  )
}
