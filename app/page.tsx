'use client'

import { useState, useEffect } from 'react'
import { 
  Play, 
  RefreshCw, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Activity,
  BarChart3,
  History,
  Settings
} from 'lucide-react'
import TestHistory from '@/components/TestHistory'
import TestDetails from '@/components/TestDetails'
import StatsCards from '@/components/StatsCards'
import TestChart from '@/components/TestChart'
import Header from '@/components/Header'
import { TestResult } from '@/types/test'

export default function Dashboard() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<TestResult | null>(null)
  const [testHistory, setTestHistory] = useState<TestResult[]>([])
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'settings'>('overview')

  // Carregar histórico de testes ao montar o componente
  useEffect(() => {
    loadTestHistory()
  }, [])

  // Polling para verificar status do teste em execução
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(async () => {
        await checkTestStatus()
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isRunning])

  const loadTestHistory = async () => {
    try {
      const response = await fetch('/api/tests')
      if (response.ok) {
        const data = await response.json()
        setTestHistory(data.tests)
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }

  const checkTestStatus = async () => {
    try {
      const response = await fetch('/api/tests/current')
      if (response.ok) {
        const data = await response.json()
        setCurrentTest(data)
        
        if (data.status === 'concluido' || data.status === 'erro') {
          setIsRunning(false)
          await loadTestHistory()
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
    }
  }

  const runTest = async () => {
    setIsRunning(true)
    setCurrentTest({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      url: 'https://homolog.genomatech.com.br/',
      login_sucesso: false,
      erros_encontrados: [],
      abas_testadas: [],
      status: 'executando'
    })

    try {
      const response = await fetch('/api/tests/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Falha ao iniciar teste')
      }

      const data = await response.json()
      console.log('Teste iniciado:', data)
    } catch (error) {
      console.error('Erro ao executar teste:', error)
      setIsRunning(false)
      alert('Erro ao iniciar teste. Verifique se o servidor backend está rodando.')
    }
  }

  const calculateStats = () => {
    const total = testHistory.length
    const success = testHistory.filter(t => t.resumo?.total_erros === 0).length
    const withErrors = total - success
    const successRate = total > 0 ? (success / total) * 100 : 0

    return {
      total,
      success,
      withErrors,
      successRate: successRate.toFixed(1)
    }
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Control Panel */}
        <div className="glass rounded-2xl p-8 mb-8 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-2">
                Controle de Testes
              </h2>
              <p className="text-slate-400">
                Execute e monitore testes automatizados da plataforma
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={loadTestHistory}
                disabled={isRunning}
                className="btn btn-secondary flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              
              <button
                onClick={runTest}
                disabled={isRunning}
                className="btn btn-primary flex items-center gap-2 relative overflow-hidden"
              >
                {isRunning ? (
                  <>
                    <div className="spinner w-4 h-4" />
                    Executando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Executar Teste
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Current Test Progress */}
          {isRunning && currentTest && (
            <div className="mt-6 p-6 bg-slate-800/50 rounded-xl border border-blue-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Teste em Execução
                </h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Status</p>
                  <p className="text-white font-medium">
                    {currentTest.status === 'executando' ? 'Executando testes...' : currentTest.status}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Abas Testadas</p>
                  <p className="text-white font-medium">
                    {currentTest.abas_testadas?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Erros Encontrados</p>
                  <p className="text-white font-medium">
                    {currentTest.erros_encontrados?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            <StatsCards stats={stats} />
            <TestChart testHistory={testHistory} />
          </>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TestHistory
                tests={testHistory}
                onSelectTest={setSelectedTest}
                selectedTestId={selectedTest?.id}
              />
            </div>
            <div className="lg:col-span-2">
              {selectedTest ? (
                <TestDetails test={selectedTest} />
              ) : (
                <div className="card h-full flex items-center justify-center">
                  <div className="text-center">
                    <History className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">
                      Selecione um teste no histórico para ver os detalhes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Configurações</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  URL da Plataforma
                </label>
                <input
                  type="text"
                  defaultValue="https://homolog.genomatech.com.br/"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Timeout (segundos)
                  </label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Espera entre cliques (seg)
                  </label>
                  <input
                    type="number"
                    defaultValue={2}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="headless"
                  className="w-4 h-4 text-blue-500"
                />
                <label htmlFor="headless" className="text-sm text-slate-300">
                  Executar em modo headless (sem interface gráfica)
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="screenshots"
                  defaultChecked
                  className="w-4 h-4 text-blue-500"
                />
                <label htmlFor="screenshots" className="text-sm text-slate-300">
                  Capturar screenshots durante os testes
                </label>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <button className="btn btn-primary">
                  Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
