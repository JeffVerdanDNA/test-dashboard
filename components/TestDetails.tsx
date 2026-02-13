import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle2, XCircle, AlertTriangle, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { TestResult } from '@/types/test'

interface TestDetailsProps {
  test: TestResult
}

export default function TestDetails({ test }: TestDetailsProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Detalhes do Teste
          </h2>
          <p className="text-slate-400 text-sm">
            {format(parseISO(test.timestamp), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>

        {test.resumo && (
          <div className={`status-badge ${test.resumo.total_erros === 0 ? 'status-success' : 'status-error'}`}>
            {test.resumo.total_erros === 0 ? 'Aprovado' : 'Reprovado'}
          </div>
        )}
      </div>

      {/* Resumo */}
      {test.resumo && (
        <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-slate-800/50 rounded-lg">
          <div>
            <p className="text-slate-400 text-xs mb-1">Abas Testadas</p>
            <p className="text-2xl font-bold text-white">
              {test.resumo.total_abas_testadas}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Sucessos</p>
            <p className="text-2xl font-bold text-green-400">
              {test.resumo.abas_com_sucesso}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Falhas</p>
            <p className="text-2xl font-bold text-red-400">
              {test.resumo.abas_com_erro}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Total de Erros</p>
            <p className="text-2xl font-bold text-red-400">
              {test.resumo.total_erros}
            </p>
          </div>
        </div>
      )}

      {/* Abas Testadas */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Abas Testadas
        </h3>

        <div className="space-y-3">
          {test.abas_testadas && test.abas_testadas.length > 0 ? (
            test.abas_testadas.map((aba, index) => (
              <div
                key={index}
                className={`
                  p-4 rounded-lg border
                  ${aba.sucesso 
                    ? 'bg-green-500/5 border-green-500/30' 
                    : 'bg-red-500/5 border-red-500/30'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {aba.sucesso ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                      <h4 className="font-semibold text-white">{aba.nome}</h4>
                    </div>

                    {aba.url_depois && (
                      <a
                        href={aba.url_depois}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {aba.url_depois}
                      </a>
                    )}

                    {aba.tempo_carregamento && (
                      <p className="text-xs text-slate-400 mt-2">
                        Tempo de carregamento: {aba.tempo_carregamento.toFixed(2)}s
                      </p>
                    )}

                    {!aba.sucesso && aba.erros && aba.erros.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {aba.erros.map((erro, errIdx) => (
                          <div key={errIdx} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="text-red-400 font-medium">{erro.tipo}:</span>
                              <span className="text-slate-300 ml-2">{erro.mensagem}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {aba.screenshot && (
                    <button
                      onClick={() => window.open(`/api/screenshots/${aba.screenshot}`, '_blank')}
                      className="ml-4 p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                      title="Ver screenshot"
                    >
                      <ImageIcon className="w-5 h-5 text-slate-300" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-center py-8">
              Nenhuma aba testada
            </p>
          )}
        </div>
      </div>

      {/* Erros Gerais */}
      {test.erros_encontrados && test.erros_encontrados.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Erros Encontrados
          </h3>

          <div className="space-y-2">
            {test.erros_encontrados.map((erro, index) => (
              <div
                key={index}
                className="p-3 bg-red-500/5 border border-red-500/30 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="text-red-400 font-medium">{erro.tipo}:</span>
                      <span className="text-slate-300 ml-2">{erro.mensagem}</span>
                    </p>
                    {erro.aba && (
                      <p className="text-xs text-slate-400 mt-1">
                        Aba: {erro.aba}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
