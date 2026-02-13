import { TrendingUp, AlertTriangle, CheckCircle2, BarChart3 } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    total: number
    success: number
    withErrors: number
    successRate: string
  }
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total de Testes',
      value: stats.total,
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Taxa de Sucesso',
      value: `${stats.successRate}%`,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      title: 'Testes Aprovados',
      value: stats.success,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
    {
      title: 'Testes com Erros',
      value: stats.withErrors,
      icon: AlertTriangle,
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="card hover-lift"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor} border ${card.borderColor}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h3 className="text-slate-400 text-sm font-medium mb-2">
              {card.title}
            </h3>
            
            <p className="text-3xl font-bold text-white">
              {card.value}
            </p>
          </div>
        )
      })}
    </div>
  )
}
