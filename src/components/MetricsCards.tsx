import React from 'react'
import { WorkflowExecution } from '../lib/supabase'
import { Activity, Clock, Coins, AlertTriangle } from 'lucide-react'

interface MetricsCardsProps {
  executions: WorkflowExecution[]
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ executions }) => {
  const totalExecutions = executions.length
  const failedExecutions = executions.filter(e => e.overall_status === 'failed').length
  const errorRate = totalExecutions > 0 ? (failedExecutions / totalExecutions) * 100 : 0

  const completedExecutions = executions.filter(e => e.total_latency_ms != null && e.total_latency_ms > 0)
  const avgLatency = completedExecutions.length > 0 
    ? completedExecutions.reduce((sum, e) => sum + e.total_latency_ms, 0) / completedExecutions.length 
    : 0

  const sortedLatencies = completedExecutions.map(e => e.total_latency_ms).sort((a, b) => a - b)
  const p95Index = Math.floor(sortedLatencies.length * 0.95)
  const p95Latency = sortedLatencies[p95Index] || 0

  const totalInputTokens = executions.reduce((sum, e) => sum + (e.input_tokens || 0), 0)
  const totalOutputTokens = executions.reduce((sum, e) => sum + (e.output_tokens || 0), 0)
  const totalTokens = executions.reduce((sum, e) => sum + (e.total_tokens || 0), 0)

  const metrics = [
    {
      title: 'Total Executions',
      value: totalExecutions.toLocaleString(),
      icon: Activity,
      color: 'blue'
    },
    {
      title: 'Error Rate',
      value: `${errorRate.toFixed(1)}%`,
      icon: AlertTriangle,
      color: errorRate > 10 ? 'red' : errorRate > 5 ? 'yellow' : 'green'
    },
    {
      title: 'Avg Latency',
      value: `${Math.round(avgLatency)}ms`,
      subtitle: `P95: ${Math.round(p95Latency)}ms`,
      icon: Clock,
      color: 'purple'
    },
    {
      title: 'Total Tokens',
      value: totalTokens.toLocaleString(),
      subtitle: `${totalInputTokens.toLocaleString()} in / ${totalOutputTokens.toLocaleString()} out`,
      icon: Coins,
      color: 'green'
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600 bg-blue-100'
      case 'red': return 'text-red-600 bg-red-100'
      case 'yellow': return 'text-yellow-600 bg-yellow-100'
      case 'green': return 'text-green-600 bg-green-100'
      case 'purple': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                {metric.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
                )}
              </div>
              <div className={`p-3 rounded-full ${getColorClasses(metric.color)}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}