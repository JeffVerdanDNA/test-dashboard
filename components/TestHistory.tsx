import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { TestResult } from '@/types/test'

interface TestHistoryProps {
  tests: TestResult[]
  onSelectTest: (test: TestResult) => void
  selectedTestId?: string
}

export default function TestHistory({ tests, onSelectTest, selectedTestId }: TestHistoryProps) {
  const getStatusIcon = (test: TestResult) => {
    if (test.status === 'executando') {
      return <Clock className="w-5 h-5 text-blue-400 animate-pulse" />
    }
    if (test.resumo?.total_erros === 0) {
      return <CheckCircle2 className="w-5 h-5 text-green-400" />
    }
    return <XCircle className="w-5 h-5 text-red-400" />
  }

  const getStatusBadge = (test: TestResult) => {
    if (test.status === 'executando') {
      return <span className="status-badge status-pending">Executando</span>
    }
    if (test.resumo?.total_erros === 0) {
      return <span className="status-badge status-success">Sucesso</span>
    }
    return <span className="status-badge status-error">Falhou</span>
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-white mb-4">
        Histórico de Execuções
      </h2>

      {tests.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Nenhum teste executado ainda</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {tests.map((test) => (
            <button
              key={test.id}
              onClick={() => onSelectTest(test)}
              className={`
                w-full text-left p-4 rounded-lg border transition-all
                ${selectedTestId === test.id
                  ? 'bg-blue-500/10 border-blue-500/50'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(test)}
                  <span className="text-sm font-medium text-white">
                    {format(parseISO(test.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                {getStatusBadge(test)}
              </div>

              {test.resumo && (
                <div className="flex gap-4 text-xs text-slate-400 mt-2">
                  <span>
                    {test.resumo.total_abas_testadas} abas
                  </span>
                  <span>
                    {test.resumo.total_erros} erros
                  </span>
                  {test.duracao && (
                    <span>
                      {test.duracao}s
                    </span>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
